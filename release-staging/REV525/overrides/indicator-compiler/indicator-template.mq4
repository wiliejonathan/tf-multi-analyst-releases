#property strict
#property indicator_chart_window
#ifdef __MQL5__
#property indicator_plots 0
#endif
#property version   "2.25"
#include <Canvas\Canvas.mqh>
#property description "TF ANALYST risk/reward. Excel timestamp is WIB (GMT+7); uses exact Created At, Opened At and Closed At from scanned history."

enum SERVER_TIME_MODE {
   MAXRICH_AUTO_DST = 0,  // GMT+3 during the historical DST window, GMT+2 outside it
   FIXED_GMT2,            // always WIB - 5 hours
   CUSTOM_OFFSET
};

input SERVER_TIME_MODE ServerTimeMode = MAXRICH_AUTO_DST;
input int  CustomServerMinusWIBMinutes = -300; // applies only with CUSTOM_OFFSET
input string SymbolFilter = "AUTO";           // AUTO follows the active chart, e.g. XAUUSD / XAUUSDm
input string AnalystFilter = "";               // blank = every analyst in this history
input bool DrawOnlyVisibleArea = true;          // redraws automatically when the chart is scrolled
input int  VisiblePaddingBars = 40;
input int  MaximumTradesPerRefresh = 700;       // protection for extreme zoom-out; 0 = no cap
input bool ShowOutcomeLabels = true;
input bool ShowTransparentPanel = true;
input int  PanelX = 12;
input int  PanelY = 22;
input int  PanelFontSize = 9;
input color PanelTextColor = clrBlack;
input color PanelDarkColor = C'40,48,58';
input int PanelOpacity = 42; // 0 transparent, 255 opaque; low default keeps black text readable
CCanvas panelCanvas;
input color RewardFill = C'174,220,183';
input color RiskFill = C'231,181,181';
input color TPTextColor = clrForestGreen;
input color SLTextColor = clrFireBrick;
input color PathColor = clrSlateGray;

struct TRADE_REC {
   int id;
   datetime createdWIB;
   datetime openedWIB;
   datetime closedWIB;
   datetime openedServer;
   datetime entryServer;
   datetime closedServer;
   string analyst;
   string side;
   string symbol;
   double entry;
   double tp;
   double sl;
   double pips;
   bool cancelled;
};

string prefix = "FTHRR_";
datetime lastFrom = 0;
datetime lastTo = 0;
bool firstDraw = true;

string raw[] = {
@@RAW@@
};

string Upper(string value) {
   StringToUpper(value);
   return(value);
}

int TFDayOfWeek(datetime value) { MqlDateTime dt; TimeToStruct(value, dt); return dt.day_of_week; }
int TFYear(datetime value) { MqlDateTime dt; TimeToStruct(value, dt); return dt.year; }
datetime LastSunday(int year, int month) {
   int nextMonth = month + 1;
   int nextYear = year;
   if(nextMonth > 12) { nextMonth = 1; nextYear++; }
   datetime firstNext = StringToTime(StringFormat("%04d.%02d.01 00:00", nextYear, nextMonth));
   datetime lastDay = (datetime)(firstNext - 86400);
   return((datetime)(lastDay - TFDayOfWeek(lastDay) * 86400));
}

bool EuropeDST(datetime wib) {
   int year = TFYear(wib);
   // Europe changes at 01:00 UTC, which is 08:00 WIB. This option is deliberately off by default.
   datetime start = (datetime)(LastSunday(year, 3) + 8 * 3600);
   datetime finish = (datetime)(LastSunday(year, 10) + 8 * 3600);
   return(wib >= start && wib < finish);
}

int WIBToServerMinutes(datetime wib) {
   if(ServerTimeMode == MAXRICH_AUTO_DST)
      return(EuropeDST(wib) ? -240 : -300);
   if(ServerTimeMode == CUSTOM_OFFSET)
      return(CustomServerMinusWIBMinutes);
   return(-300);
}

datetime WIBToServer(datetime wib) {
   return((datetime)(wib + WIBToServerMinutes(wib) * 60));
}

string OffsetText() {
   if(ServerTimeMode == MAXRICH_AUTO_DST) return("auto GMT+2/GMT+3");
   int min = (ServerTimeMode == CUSTOM_OFFSET ? CustomServerMinusWIBMinutes : -300);
   int absMin = MathAbs(min);
   return(StringFormat("WIB %c%d:%02d", min < 0 ? '-' : '+', absMin / 60, absMin % 60));
}

bool ParseTrade(int index, TRADE_REC &tr) {
   string fields[];
   int fieldCount = StringSplit(raw[index], ';', fields);
   if(fieldCount < 12) return(false);
   tr.cancelled = (fieldCount > 12 && fields[12] == "Cancelled");
   tr.id = (int)StringToInteger(fields[0]);
   tr.createdWIB = StringToTime(fields[11]);
   tr.openedWIB = (fields[1] == "" ? 0 : StringToTime(fields[1]));
   tr.closedWIB = StringToTime(fields[2]);
   tr.analyst = fields[3];
   tr.side = fields[4];
   tr.symbol = fields[5];
   tr.entry = StringToDouble(fields[6]);
   tr.tp = StringToDouble(fields[7]);
   tr.sl = StringToDouble(fields[8]);
   tr.pips = StringToDouble(fields[9]);
   tr.openedServer = (tr.openedWIB > 0 ? WIBToServer(tr.openedWIB) : 0);
   int entryDelayMinutes = (int)StringToInteger(fields[10]);
   tr.entryServer = (entryDelayMinutes >= 0 ? (datetime)(tr.openedServer + entryDelayMinutes * 60) : tr.openedServer);
   tr.closedServer = WIBToServer(tr.closedWIB);
   if(tr.cancelled && tr.openedServer == 0) tr.entryServer = WIBToServer(tr.createdWIB);
   return(tr.entryServer > 0 && tr.closedServer >= tr.entryServer && tr.entry > 0 && tr.tp > 0 && tr.sl > 0);
}

bool MatchesChartSymbol(string tradeSymbol) {
   string wanted = SymbolFilter;
   if(wanted == "" || Upper(wanted) == "AUTO") wanted = Symbol();
   wanted = Upper(wanted);
   string item = Upper(tradeSymbol);
   return(StringFind(wanted, item, 0) >= 0 || StringFind(item, wanted, 0) >= 0);
}

bool MatchesFilters(TRADE_REC &tr) {
   if(!MatchesChartSymbol(tr.symbol)) return(false);
   if(AnalystFilter != "" && StringFind(Upper(tr.analyst), Upper(AnalystFilter), 0) < 0) return(false);
   return(true);
}

bool IsVisible(TRADE_REC &tr, datetime fromTime, datetime toTime) {
   if(!DrawOnlyVisibleArea) return(true);
   return(tr.closedServer >= fromTime && tr.entryServer <= toTime);
}

void DeletePrefixed() {
   panelCanvas.Destroy();
   for(int i = ObjectsTotal(0, -1, -1) - 1; i >= 0; i--) {
      string name = ObjectName(0, i, -1, -1);
      if(StringFind(name, prefix, 0) == 0) ObjectDelete(0, name);
   }
}

void MakeRectangle(string name, datetime t1, datetime t2, double p1, double p2, color tone) {
   ObjectCreate(0, name, OBJ_RECTANGLE, 0, t1, p1, t2, p2);
   ObjectSetInteger(0, name, OBJPROP_COLOR, tone);
   ObjectSetInteger(0, name, OBJPROP_STYLE, STYLE_SOLID);
   ObjectSetInteger(0, name, OBJPROP_WIDTH, 1);
   ObjectSetInteger(0, name, OBJPROP_FILL, true);
   ObjectSetInteger(0, name, OBJPROP_BACK, true);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, name, OBJPROP_HIDDEN, true);
}

void MakeOutcomePath(string name, TRADE_REC &tr, bool tpHit) {
   double exitPrice = tpHit ? tr.tp : tr.sl;
   ObjectCreate(0, name, OBJ_TREND, 0, tr.entryServer, tr.entry, tr.closedServer, exitPrice);
   ObjectSetInteger(0, name, OBJPROP_COLOR, PathColor);
   ObjectSetInteger(0, name, OBJPROP_STYLE, STYLE_DASH);
   ObjectSetInteger(0, name, OBJPROP_WIDTH, 1);
   ObjectSetInteger(0, name, OBJPROP_RAY_RIGHT, false);
   ObjectSetInteger(0, name, OBJPROP_BACK, false);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, name, OBJPROP_HIDDEN, true);
}

// Screen-space labels stay legible when multiple orders close on one candle.
// Never move a label far away from its trade; crowded labels retain tooltips.
int outcomeLabelX[], outcomeLabelY[], outcomeLabelW[];
int outcomeChartWidth = 0, outcomeChartHeight = 0;

bool OutcomeLabelFits(int x, int y, int width) {
   if(ShowTransparentPanel && x < PanelX + MathMax(365, 365 * PanelFontSize / 9) && y < PanelY + 9 * (PanelFontSize + 10) + 24) return false;
   if(x < 4 || y < 4 || x + width > outcomeChartWidth - 4 ||
      y + 16 > outcomeChartHeight - 4) return false;
   for(int i = 0; i < ArraySize(outcomeLabelX); i++) {
      if(x < outcomeLabelX[i] + outcomeLabelW[i] + 5 &&
         x + width + 5 > outcomeLabelX[i] &&
         y < outcomeLabelY[i] + 20 && y + 20 > outcomeLabelY[i]) return false;
   }
   return true;
}

void MakeOutcomeLabel(string name, TRADE_REC &tr, bool tpHit) {
   if(!ShowOutcomeLabels) return;
   double price = tr.cancelled ? tr.entry : (tpHit ? tr.tp : tr.sl);
   int px = 0, py = 0;
   if(!ChartTimePriceToXY(0, 0, tr.closedServer, price, px, py)) return;
   // An off-screen price is not clamped into a misleading pile at a chart edge.
   if(px < 0 || px > outcomeChartWidth || py < 0 || py > outcomeChartHeight) return;
   string text = tr.cancelled ? "Cancelled" : (tpHit ? "TP" : "SL");
   color tone = tr.cancelled ? clrDimGray : (tpHit ? TPTextColor : SLTextColor);
   int font = MathMax(7, PanelFontSize - 1);
   int width = (int)MathCeil(StringLen(text) * font * 0.75) + 6;
   int dx[] = {5, 5, -25, -25, 5, -25};
   int dy[] = {-18, 3, -18, 3, -38, -38};
   for(int candidate = 0; candidate < ArraySize(dx); candidate++) {
      int x = px + dx[candidate], y = py + dy[candidate];
      if(!OutcomeLabelFits(x, y, width)) continue;
      if(!ObjectCreate(0, name, OBJ_LABEL, 0, 0, 0)) return;
      ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetInteger(0, name, OBJPROP_ANCHOR, ANCHOR_LEFT_UPPER);
      ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
      ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
      ObjectSetInteger(0, name, OBJPROP_FONTSIZE, font);
      ObjectSetInteger(0, name, OBJPROP_COLOR, tone);
      ObjectSetString(0, name, OBJPROP_FONT, "Arial");
      ObjectSetString(0, name, OBJPROP_TEXT, text);
      ObjectSetString(0, name, OBJPROP_TOOLTIP,
         StringFormat("#%d %s | %s", tr.id, text,
            TimeToString(tr.closedWIB, TIME_DATE|TIME_MINUTES)));
      ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
      ObjectSetInteger(0, name, OBJPROP_HIDDEN, true);
      int size = ArraySize(outcomeLabelX);
      ArrayResize(outcomeLabelX, size + 1);
      ArrayResize(outcomeLabelY, size + 1);
      ArrayResize(outcomeLabelW, size + 1);
      outcomeLabelX[size] = x; outcomeLabelY[size] = y; outcomeLabelW[size] = width;
      return;
   }
   // The rectangle tooltip still exposes the outcome when all nearby slots are full.
}

void DrawTrade(TRADE_REC &tr) {
   string key = prefix + "T" + IntegerToString(tr.id);
   MakeRectangle(key + "_RISK", tr.entryServer, tr.closedServer, MathMin(tr.entry, tr.sl), MathMax(tr.entry, tr.sl), tr.cancelled ? clrSilver : RiskFill);
   MakeRectangle(key + "_REWARD", tr.entryServer, tr.closedServer, MathMin(tr.entry, tr.tp), MathMax(tr.entry, tr.tp), tr.cancelled ? clrSilver : RewardFill);
   bool tpHit = (tr.pips > 0.0);
   if(!tr.cancelled) MakeOutcomePath(key + "_PATH", tr, tpHit);
   MakeOutcomeLabel(key + "_LABEL", tr, tpHit);
   string tip = (tr.cancelled ? "Cancelled (not executed; excluded from TP/SL/R)\n" : "") + StringFormat("#%d %s %s | %s\nCreated WIB: %s\nOpened WIB: %s\nClosed WIB: %s\nOpened server: %s\nClosed server: %s\nEntry %.2f | TP %.2f | SL %.2f\nPlanned RR 1:%.2f | Pips %.1f", tr.id, tr.side, tr.symbol, tr.analyst,
      TimeToString(tr.createdWIB, TIME_DATE|TIME_MINUTES), (tr.openedWIB > 0 ? TimeToString(tr.openedWIB, TIME_DATE|TIME_MINUTES) : "Not opened"), TimeToString(tr.closedWIB, TIME_DATE|TIME_MINUTES),
      TimeToString(tr.entryServer, TIME_DATE|TIME_MINUTES), TimeToString(tr.closedServer, TIME_DATE|TIME_MINUTES), tr.entry, tr.tp, tr.sl,
      MathAbs(tr.tp-tr.entry)/MathAbs(tr.sl-tr.entry), tr.pips);
   ObjectSetString(0, key + "_RISK", OBJPROP_TOOLTIP, tip);
   ObjectSetString(0, key + "_REWARD", OBJPROP_TOOLTIP, tip);
   ObjectSetString(0, key + "_PATH", OBJPROP_TOOLTIP, tip);
}

void PanelLine(int row, string text, color tone) {
   string name = prefix + "P" + IntegerToString(row);
   ObjectCreate(0, name, OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, name, OBJPROP_XDISTANCE, PanelX + 12);
   ObjectSetInteger(0, name, OBJPROP_YDISTANCE, PanelY + 12 + row * (PanelFontSize + 10));
   ObjectSetString(0, name, OBJPROP_TEXT, text);
   ObjectSetString(0, name, OBJPROP_FONT, "Arial");
   ObjectSetInteger(0, name, OBJPROP_FONTSIZE, row == 0 ? PanelFontSize + 2 : PanelFontSize);
   ObjectSetInteger(0, name, OBJPROP_COLOR, PanelTextColor);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, name, OBJPROP_HIDDEN, true);
}

void DrawPanel(int total, int tpCount, int slCount, double profitPips, double lossPips, datetime firstWib, datetime lastWib, double netR, double avgRR) {
   if(!ShowTransparentPanel) return;
   int height = 9 * (PanelFontSize + 10) + 24;
   int width = MathMax(365, 365 * PanelFontSize / 9);
   if(panelCanvas.CreateBitmapLabel(0, 0, prefix + "BACKGROUND", PanelX, PanelY, width, height, COLOR_FORMAT_ARGB_NORMALIZE)) {
      panelCanvas.Erase(ColorToARGB(PanelDarkColor, (uchar)MathMax(0, MathMin(255, PanelOpacity))));
      panelCanvas.Update();
      ObjectSetInteger(0, prefix + "BACKGROUND", OBJPROP_BACK, false);
      ObjectSetInteger(0, prefix + "BACKGROUND", OBJPROP_SELECTABLE, false);
      ObjectSetInteger(0, prefix + "BACKGROUND", OBJPROP_HIDDEN, true);
   }
   PanelLine(0, "TF ANALYST | RR HISTORY", clrWhite);
   PanelLine(1, "History WIB -> server: " + OffsetText(), clrLightSteelBlue);
   PanelLine(2, StringFormat("TP %d | SL %d | Trade %d | R %+.2f", tpCount, slCount, total, netR), clrWhite);
   PanelLine(3, StringFormat("Pips +%.1f | %.1f | Net %.1f", profitPips, lossPips, profitPips + lossPips), clrLightSteelBlue);
   PanelLine(4, StringFormat("Filter: %s | %s", SymbolFilter == "AUTO" ? Symbol() : SymbolFilter, AnalystFilter == "" ? "all analyst" : AnalystFilter), clrLightSteelBlue);
   PanelLine(5, StringFormat("Data: %s - %s WIB", TimeToString(firstWib, TIME_DATE), TimeToString(lastWib, TIME_DATE)), clrLightSteelBlue);
   PanelLine(6, "Entry: Opened At | Cancelled: Created At", clrLightSteelBlue);
   PanelLine(8, StringFormat("Planned RR avg 1:%.2f", avgRR), clrLightSteelBlue);
   PanelLine(7, DrawOnlyVisibleArea ? "Display: visible chart only" : "Display: full loaded history", clrLightSteelBlue);
}

bool VisibleBounds(datetime &fromTime, datetime &toTime) {
   int chartBars = iBars(_Symbol, _Period);
   if(chartBars < 2) return(false);
   int first = (int)ChartGetInteger(0, CHART_FIRST_VISIBLE_BAR);
   int count = (int)ChartGetInteger(0, CHART_VISIBLE_BARS);
   if(first < 0 || count <= 0) return(false);
   int right = MathMax(0, first - count + 1);
   fromTime = iTime(_Symbol, _Period, MathMin(first, chartBars - 1));
   toTime = iTime(_Symbol, _Period, right);
   if(fromTime > toTime) { datetime hold = fromTime; fromTime = toTime; toTime = hold; }
   int seconds = PeriodSeconds();
   if(seconds <= 0) seconds = Period() * 60;
   fromTime = (datetime)(fromTime - MathMax(0, VisiblePaddingBars) * seconds);
   toTime = (datetime)(toTime + MathMax(0, VisiblePaddingBars) * seconds);
   return(true);
}

void Redraw(bool force) {
   datetime fromTime = 0, toTime = 0;
   if(DrawOnlyVisibleArea && !VisibleBounds(fromTime, toTime)) return;
   if(!force && !firstDraw && fromTime == lastFrom && toTime == lastTo) return;
   DeletePrefixed();
   ArrayResize(outcomeLabelX, 0);
   ArrayResize(outcomeLabelY, 0);
   ArrayResize(outcomeLabelW, 0);
   outcomeChartWidth = (int)ChartGetInteger(0, CHART_WIDTH_IN_PIXELS, 0);
   outcomeChartHeight = (int)ChartGetInteger(0, CHART_HEIGHT_IN_PIXELS, 0);
   int total = 0, tpCount = 0, slCount = 0, drawn = 0;
   double profitPips = 0.0, lossPips = 0.0, netR = 0.0, sumRR = 0.0;
   datetime firstWib = 0, lastWib = 0;
   // Data are sorted by Excel order; draw oldest to newest so the later trade remains readable.
   for(int i = 0; i < ArraySize(raw); i++) {
      TRADE_REC tr;
      if(!ParseTrade(i, tr) || !MatchesFilters(tr)) continue;
      if(!tr.cancelled) {
      total++;
      double pipSize = 0.1;
      string symbol = Upper(tr.symbol);
      if(StringFind(symbol, "XAG") == 0 || StringFind(symbol, "JPY") >= 0) pipSize = 0.01;
      else if(StringFind(symbol, "XAU") != 0 && StringLen(symbol) == 6) pipSize = 0.0001;
      double risk = MathAbs(tr.entry - tr.sl);
      if(risk > 0) { netR += tr.pips * pipSize / risk; sumRR += MathAbs(tr.tp-tr.entry)/risk; }
      if(tr.pips > 0.0) { tpCount++; profitPips += tr.pips; } else { slCount++; lossPips += tr.pips; }
      }
      datetime rangeStart = tr.cancelled ? tr.createdWIB : tr.openedWIB;
      if(firstWib == 0 || rangeStart < firstWib) firstWib = rangeStart;
      if(lastWib == 0 || tr.closedWIB > lastWib) lastWib = tr.closedWIB;
      if(!IsVisible(tr, fromTime, toTime)) continue;
      if(MaximumTradesPerRefresh > 0 && drawn >= MaximumTradesPerRefresh) continue;
      DrawTrade(tr);
      drawn++;
   }
   DrawPanel(total, tpCount, slCount, profitPips, lossPips, firstWib, lastWib, netR, total > 0 ? sumRR/total : 0);
   lastFrom = fromTime;
   lastTo = toTime;
   firstDraw = false;
   ChartRedraw(0);
}

int OnInit() {
   prefix = "FTHRR_" + IntegerToString(GetTickCount()) + "_";
   EventSetTimer(1);
   Redraw(true);
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason) {
   EventKillTimer();
   DeletePrefixed();
}

void OnTimer() { Redraw(false); }

void OnChartEvent(const int id, const long &lparam, const double &dparam, const string &sparam) {
   if(id == CHARTEVENT_CHART_CHANGE) Redraw(true);
}

int OnCalculate(const int rates_total, const int prev_calculated, const datetime &time[], const double &open[], const double &high[], const double &low[], const double &close[], const long &tick_volume[], const long &volume[], const int &spread[]) {
   if(firstDraw) Redraw(true);
   return(rates_total);
}
