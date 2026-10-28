#property strict
#property indicator_chart_window
#ifdef __MQL5__
#property indicator_plots 0
#endif
#property version   "2.29"
#include <Canvas\Canvas.mqh>
#property description "TF ANALYST risk/reward. Excel timestamp is WIB (GMT+7); uses exact Created At, Opened At and Closed At from scanned history."

enum SERVER_TIME_MODE {
   EUROPE_DST_OPT_IN = 0,  // GMT+3 during the historical DST window, GMT+2 outside it
   FIXED_GMT2,            // always WIB - 5 hours
   CUSTOM_OFFSET
};

input SERVER_TIME_MODE ServerTimeMode = FIXED_GMT2;
input int  CustomServerMinusWIBMinutes = -300; // applies only with CUSTOM_OFFSET
input string SymbolFilter = "AUTO";           // AUTO follows the active chart, e.g. XAUUSD / XAUUSDm
input string AnalystFilter = "";               // blank = every analyst in this history
input bool DrawOnlyVisibleArea = true;          // redraws automatically when the chart is scrolled
input int  VisiblePaddingBars = 40;
input int  MaximumTradesPerRefresh = 700;       // protection for extreme zoom-out; 0 = no cap
input bool ShowOutcomeLabels = true;
input bool ShowTradeTP = true;
input bool ShowTradeSL = true;
input bool ShowTradeCancelled = true;
bool tpTradesVisible = true;
bool slTradesVisible = true;
bool cancelledTradesVisible = true;
input bool ShowInfoPanel = true;
input bool IncludeSwap = true;
input bool IncludeComm = true;
bool swapCostsEnabled = true;
bool commCostsEnabled = true;
long originalChartForeground = 0;
bool foregroundCaptured = false;
input int  PanelX = 12;
input int  PanelY = 22;
input int  PanelFontSize = 9;
input color PanelTextColor = clrBlack;
input color PanelBackgroundColor = C'238,242,246'; // always solid
CCanvas panelCanvas;
input color RewardFill = C'174,220,183';
input color RiskFill = C'231,181,181';
input color TPTextColor = clrForestGreen;
input color SLTextColor = clrFireBrick;
input color PathColor = clrSlateGray;
input int PendingColorStrength = 35; // 5..95%, softer Created -> Opened segment

struct TRADE_REC {
   int id;
   datetime createdWIB;
   datetime openedWIB;
   datetime closedWIB;
   datetime createdServer;
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
   double lot;
   double dollarPerPip;
   double riskDollar;
   double grossDollar;
   double swapDollar;
   double commDollar;
};

string prefix = "FTHRR_";
datetime lastFrom = 0;
datetime lastTo = 0;
bool firstDraw = true;
int lastBarCount = -1;
int historyGapTrades = 0;

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
   // Optional European historical rule; never infer a broker schedule from its name.
   datetime start = (datetime)(LastSunday(year, 3) + 8 * 3600);
   datetime finish = (datetime)(LastSunday(year, 10) + 8 * 3600);
   return(wib >= start && wib < finish);
}

int WIBToServerMinutes(datetime wib) {
   if(ServerTimeMode == EUROPE_DST_OPT_IN)
      return(EuropeDST(wib) ? -240 : -300);
   if(ServerTimeMode == CUSTOM_OFFSET)
      return(CustomServerMinusWIBMinutes);
   return(-300);
}

datetime WIBToServer(datetime wib) {
   return((datetime)(wib + WIBToServerMinutes(wib) * 60));
}

string OffsetText() {
   if(ServerTimeMode == EUROPE_DST_OPT_IN) return("auto GMT+2/GMT+3");
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
   tr.createdServer = WIBToServer(tr.createdWIB);
   tr.openedServer = (tr.openedWIB > 0 ? WIBToServer(tr.openedWIB) : 0);
   tr.entryServer = tr.openedServer; // exact Opened At; no implicit entry delay
   tr.closedServer = WIBToServer(tr.closedWIB);
   if(tr.cancelled && tr.openedServer == 0) tr.entryServer = WIBToServer(tr.createdWIB);
   tr.lot = fieldCount > 13 ? StringToDouble(fields[13]) : 0;
   tr.dollarPerPip = fieldCount > 14 ? StringToDouble(fields[14]) : 0;
   tr.riskDollar = fieldCount > 15 ? StringToDouble(fields[15]) : 0;
   tr.grossDollar = fieldCount > 16 ? StringToDouble(fields[16]) : 0;
   tr.swapDollar = fieldCount > 17 ? StringToDouble(fields[17]) : 0;
   tr.commDollar = fieldCount > 18 ? StringToDouble(fields[18]) : 0;
   return(tr.createdServer > 0 && tr.createdServer <= tr.entryServer && tr.entryServer > 0 && tr.closedServer >= tr.entryServer && tr.entry > 0 && tr.tp > 0 && tr.sl > 0);
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
   return(tr.closedServer >= fromTime && tr.createdServer <= toTime);
}

// A time inside a history gap must never snap to the nearest available candle.
bool HasChartCandle(datetime timestamp) {
   int shift = iBarShift(_Symbol, _Period, timestamp, true);
   if(shift < 0) return false;
   datetime start = iTime(_Symbol, _Period, shift);
   int seconds = PeriodSeconds(_Period);
   if(seconds <= 0) return false;
   return(start > 0 && timestamp >= start && timestamp < start + seconds);
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
int outcomeLabelX[], outcomeLabelY[], outcomeLabelW[], outcomeLabelH[];
int outcomeChartWidth = 0, outcomeChartHeight = 0;
bool outcomeFontReady = false;

bool OutcomeLabelFits(int x, int y, int width, int height) {
   if(ShowInfoPanel && x < PanelX + MathMax(365, 365 * PanelFontSize / 9) && y < PanelY + 15 * (PanelFontSize + 10) + 28) return false;
   if(x < 4 || y < 4 || x + width > outcomeChartWidth - 4 ||
      y + height > outcomeChartHeight - 4) return false;
   for(int i = 0; i < ArraySize(outcomeLabelX); i++) {
      if(x < outcomeLabelX[i] + outcomeLabelW[i] + 5 &&
         x + width + 5 > outcomeLabelX[i] &&
         y < outcomeLabelY[i] + outcomeLabelH[i] + 5 && y + height + 5 > outcomeLabelY[i]) return false;
   }
   return true;
}

void MakeOutcomeLabel(string name, TRADE_REC &tr, bool tpHit) {
   if(!ShowOutcomeLabels) return;
   if(!HasChartCandle(tr.closedServer)) return;
   double price = tr.cancelled ? tr.entry : (tpHit ? tr.tp : tr.sl);
   int px = 0, py = 0;
   if(!ChartTimePriceToXY(0, 0, tr.closedServer, price, px, py)) return;
   // An off-screen price is not clamped into a misleading pile at a chart edge.
   if(px < 0 || px > outcomeChartWidth || py < 0 || py > outcomeChartHeight) return;
   string text = tr.cancelled ? "Cancelled" : (tpHit ? "TP" : "SL");
   color tone = tr.cancelled ? clrDimGray : (tpHit ? TPTextColor : SLTextColor);
   int font = MathMax(7, PanelFontSize - 1);
   if(!outcomeFontReady) outcomeFontReady = TextSetFont("Arial", -font * 10, FW_NORMAL);
   uint textWidth = 0, textHeight = 0;
   double scale = MathMax(1.0, (double)TerminalInfoInteger(TERMINAL_SCREEN_DPI) / 96.0);
   bool measured = outcomeFontReady && TextGetSize(text, textWidth, textHeight);
   int width = measured ? (int)textWidth + 8 : (int)MathCeil(StringLen(text) * font * scale) + 8;
   int height = measured ? (int)textHeight + 4 : (int)MathCeil(font * 1.8 * scale) + 4;
   int dx[6], dy[6];
   dx[0]=5; dx[1]=5; dx[2]=-width-5; dx[3]=-width-5; dx[4]=5; dx[5]=-width-5;
   dy[0]=-height-4; dy[1]=4; dy[2]=-height-4; dy[3]=4; dy[4]=-2*height-8; dy[5]=-2*height-8;
   for(int candidate = 0; candidate < ArraySize(dx); candidate++) {
      int x = px + dx[candidate], y = py + dy[candidate];
      if(!OutcomeLabelFits(x, y, width, height)) continue;
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
      ArrayResize(outcomeLabelH, size + 1);
      outcomeLabelX[size] = x; outcomeLabelY[size] = y; outcomeLabelW[size] = width; outcomeLabelH[size] = height;
      return;
   }
   // The rectangle tooltip still exposes the outcome when all nearby slots are full.
}

color PendingTone(color tone) {
   color bg=(color)ChartGetInteger(0, CHART_COLOR_BACKGROUND);
   double f=MathMax(5,MathMin(95,PendingColorStrength))/100.0;
   int red=(int)(((int)tone&255)*f+((int)bg&255)*(1-f));
   int green=(int)((((int)tone>>8)&255)*f+(((int)bg>>8)&255)*(1-f));
   int blue=(int)((((int)tone>>16)&255)*f+(((int)bg>>16)&255)*(1-f));
   return((color)(red|(green<<8)|(blue<<16)));
}
void DrawTrade(TRADE_REC &tr) {
   string key=prefix+"T"+IntegerToString(tr.id);
   if(tr.cancelled) {
      MakeRectangle(key+"_RISK",tr.createdServer,tr.closedServer,MathMin(tr.entry,tr.sl),MathMax(tr.entry,tr.sl),clrSilver);
      MakeRectangle(key+"_REWARD",tr.createdServer,tr.closedServer,MathMin(tr.entry,tr.tp),MathMax(tr.entry,tr.tp),clrSilver);
   } else {
      if(tr.createdServer<tr.entryServer) {
         MakeRectangle(key+"_PENDING_RISK",tr.createdServer,tr.entryServer,MathMin(tr.entry,tr.sl),MathMax(tr.entry,tr.sl),PendingTone(RiskFill));
         MakeRectangle(key+"_PENDING_REWARD",tr.createdServer,tr.entryServer,MathMin(tr.entry,tr.tp),MathMax(tr.entry,tr.tp),PendingTone(RewardFill));
      }
      MakeRectangle(key+"_RISK",tr.entryServer,tr.closedServer,MathMin(tr.entry,tr.sl),MathMax(tr.entry,tr.sl),RiskFill);
      MakeRectangle(key+"_REWARD",tr.entryServer,tr.closedServer,MathMin(tr.entry,tr.tp),MathMax(tr.entry,tr.tp),RewardFill);
      string marker=key+"_OPENED";
      ObjectCreate(0,marker,OBJ_TREND,0,tr.entryServer,MathMin(tr.sl,tr.tp),tr.entryServer,MathMax(tr.sl,tr.tp));
      ObjectSetInteger(0,marker,OBJPROP_COLOR,PathColor);ObjectSetInteger(0,marker,OBJPROP_STYLE,STYLE_DOT);
      ObjectSetInteger(0,marker,OBJPROP_RAY_RIGHT,false);ObjectSetInteger(0,marker,OBJPROP_BACK,true);ObjectSetInteger(0,marker,OBJPROP_SELECTABLE,false);
   }
   bool tpHit=tr.pips>0;
   if(!tr.cancelled)MakeOutcomePath(key+"_PATH",tr,tpHit);
   MakeOutcomeLabel(key+"_LABEL",tr,tpHit);
   string tip=(tr.cancelled?"Cancelled: not executed; no costs\n":"Soft: Created -> Opened | Main: Opened -> Closed\n")+
     StringFormat("%s | %s | %s\nCreated WIB: %s | server: %s\nOpened WIB: %s | server: %s\nClosed WIB: %s | server: %s\nEntry %.2f | TP %.2f | SL %.2f\nLot %.2f | Gross $%.2f | Swap $%.2f | Comm $%.2f",tr.analyst,tr.symbol,OffsetText(),
       TimeToString(tr.createdWIB,TIME_DATE|TIME_MINUTES),TimeToString(tr.createdServer,TIME_DATE|TIME_MINUTES),
       tr.openedWIB>0?TimeToString(tr.openedWIB,TIME_DATE|TIME_MINUTES):"Not opened",tr.openedServer>0?TimeToString(tr.openedServer,TIME_DATE|TIME_MINUTES):"Not opened",
       TimeToString(tr.closedWIB,TIME_DATE|TIME_MINUTES),TimeToString(tr.closedServer,TIME_DATE|TIME_MINUTES),tr.entry,tr.tp,tr.sl,tr.lot,tr.grossDollar,tr.swapDollar,tr.commDollar);
   string suffixes[]={"_RISK","_REWARD","_PENDING_RISK","_PENDING_REWARD","_PATH","_OPENED"};
   for(int n=0;n<ArraySize(suffixes);n++)if(ObjectFind(0,key+suffixes[n])>=0)ObjectSetString(0,key+suffixes[n],OBJPROP_TOOLTIP,tip);
}

void PanelLine(int row, string text, color tone) {
   string name = prefix + "P" + IntegerToString(row);
   ObjectCreate(0, name, OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, name, OBJPROP_XDISTANCE, PanelX + 12);
   ObjectSetInteger(0, name, OBJPROP_YDISTANCE, PanelY + 12 + (row + 1) * (PanelFontSize + 10));
   ObjectSetString(0, name, OBJPROP_TEXT, text);
   ObjectSetString(0, name, OBJPROP_TOOLTIP, text);
   ObjectSetString(0, name, OBJPROP_FONT, "Arial");
   ObjectSetInteger(0, name, OBJPROP_FONTSIZE, row <= 0 ? PanelFontSize + 2 : PanelFontSize);
   ObjectSetInteger(0, name, OBJPROP_COLOR, PanelTextColor);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, name, OBJPROP_HIDDEN, true);
}

string panelAnalysts[];
void RememberPanelAnalyst(string analyst) {
   for(int i = 0; i < ArraySize(panelAnalysts); i++) if(panelAnalysts[i] == analyst) return;
   int count = ArraySize(panelAnalysts);
   ArrayResize(panelAnalysts, count + 1);
   panelAnalysts[count] = analyst;
}
string PanelAnalystNames() {
   string names = "";
   for(int i = 0; i < ArraySize(panelAnalysts); i++) {
      if(i > 0) names += ", ";
      names += panelAnalysts[i];
   }
   return names == "" ? "-" : names;
}

// Checkboxes affect drawing only, never performance totals.
bool TradeCategoryVisible(TRADE_REC &tr) {
   if(tr.cancelled) return cancelledTradesVisible;
   return tr.pips > 0.0 ? tpTradesVisible : slTradesVisible;
}

void PanelCheckbox(string key, string caption, bool checked, int x, int y, color tone) {
   string name = prefix + key;
   ObjectCreate(0, name, OBJ_BUTTON, 0, 0, 0);
   ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
   ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
   ObjectSetInteger(0, name, OBJPROP_XSIZE, 16);
   ObjectSetInteger(0, name, OBJPROP_YSIZE, 16);
   ObjectSetInteger(0, name, OBJPROP_FONTSIZE, 9);
   ObjectSetInteger(0, name, OBJPROP_COLOR, checked ? clrWhite : clrSilver);
   ObjectSetInteger(0, name, OBJPROP_BGCOLOR, checked ? tone : clrDimGray);
   ObjectSetInteger(0, name, OBJPROP_BORDER_COLOR, clrGray);
   ObjectSetInteger(0, name, OBJPROP_STATE, false);
   ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, name, OBJPROP_HIDDEN, true);
   ObjectSetInteger(0, name, OBJPROP_ZORDER, 10);
   ObjectSetString(0, name, OBJPROP_TEXT, checked ? "x" : "");
   ObjectSetString(0, name, OBJPROP_TOOLTIP, caption + (checked ? ": tampil (klik untuk sembunyikan)" : ": tersembunyi (klik untuk tampilkan)"));
   string label = name + "_TEXT";
   ObjectCreate(0, label, OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, label, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, label, OBJPROP_ANCHOR, ANCHOR_LEFT_UPPER);
   ObjectSetInteger(0, label, OBJPROP_XDISTANCE, x + 21);
   ObjectSetInteger(0, label, OBJPROP_YDISTANCE, y + 1);
   ObjectSetInteger(0, label, OBJPROP_FONTSIZE, MathMax(7, PanelFontSize - 1));
   ObjectSetInteger(0, label, OBJPROP_COLOR, PanelTextColor);
   ObjectSetInteger(0, label, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, label, OBJPROP_HIDDEN, true);
   ObjectSetInteger(0, label, OBJPROP_ZORDER, 10);
   ObjectSetString(0, label, OBJPROP_FONT, "Arial");
   ObjectSetString(0, label, OBJPROP_TEXT, caption);
   ObjectSetString(0, label, OBJPROP_TOOLTIP, "Klik untuk tick/untick " + caption);
}

void DrawPanel(int total, int tpCount, int slCount, double profitPips, double lossPips, datetime firstWib, datetime lastWib, double netR, double avgRR, double netDollar, double netPips, double swapTotal, double commTotal) {
   if(!ShowInfoPanel) return;
   int height = 15 * (PanelFontSize + 10) + 28;
   int width = MathMax(365, 365 * PanelFontSize / 9);
   if(panelCanvas.CreateBitmapLabel(0, 0, prefix + "BACKGROUND", PanelX, PanelY, width, height, COLOR_FORMAT_ARGB_NORMALIZE)) {
      panelCanvas.Erase(ColorToARGB(PanelBackgroundColor,255));
      panelCanvas.Update();
      ObjectSetInteger(0, prefix + "BACKGROUND", OBJPROP_BACK, false);
      ObjectSetInteger(0, prefix + "BACKGROUND", OBJPROP_SELECTABLE, false);
      ObjectSetInteger(0, prefix + "BACKGROUND", OBJPROP_HIDDEN, true);
   }
   PanelLine(0, "TF ANALYST | RR HISTORY", clrWhite);
   PanelLine(1, "History WIB -> server: " + OffsetText(), clrLightSteelBlue);
   PanelLine(2, StringFormat("TP %d | SL %d | Trade %d | R %+.2f", tpCount, slCount, total, netR), clrWhite);
   PanelLine(3, StringFormat("Pips +%.1f | %.1f | Net %.1f", profitPips, lossPips, profitPips + lossPips), clrLightSteelBlue);
   string analystNames = PanelAnalystNames();
   string analystDisplay = StringLen(analystNames) > 28 ? StringSubstr(analystNames, 0, 28) + "..." : analystNames;
   string pairDisplay = SymbolFilter == "AUTO" ? Symbol() : SymbolFilter;
   PanelLine(-1, Upper(analystDisplay) + " | " + Upper(pairDisplay), clrWhite);
   ObjectSetString(0, prefix + "P-1", OBJPROP_TOOLTIP, Upper(analystNames) + " | " + Upper(pairDisplay));
   PanelLine(4, "Filter: " + pairDisplay, clrLightSteelBlue);
   PanelLine(5, StringFormat("Data: %s - %s WIB", TimeToString(firstWib, TIME_DATE), TimeToString(lastWib, TIME_DATE)), clrLightSteelBlue);
   PanelLine(6,"Soft: Created -> Opened | Main: Opened -> Closed",clrLightSteelBlue);
   PanelLine(8, StringFormat("Planned RR avg 1:%.2f", avgRR), clrLightSteelBlue);
   string display = DrawOnlyVisibleArea ? "Display: visible chart only" : "Display: full loaded history";
   if(historyGapTrades > 0) display += StringFormat(" | Missing candles: %d", historyGapTrades);
   PanelLine(7, display, clrLightSteelBlue);
   PanelLine(9,StringFormat("Net $%+.2f | Net pips %+.2f",netDollar,netPips),clrLightSteelBlue);
   PanelLine(10,StringFormat("Swap $%.2f | Comm $%.2f (snapshot / lot)",swapTotal,commTotal),clrLightSteelBlue);
   int toggleY = PanelY + 12 + 12 * (PanelFontSize + 10);
   int toggleColumn = (width - 24) / 3;
   PanelCheckbox("FILTER_TP", "Trade TP", tpTradesVisible, PanelX + 12, toggleY, clrForestGreen);
   PanelCheckbox("FILTER_SL", "Trade SL", slTradesVisible, PanelX + 12 + toggleColumn, toggleY, clrFireBrick);
   PanelCheckbox("FILTER_CANCELLED", "Trade Cancelled", cancelledTradesVisible, PanelX + 12 + 2 * toggleColumn, toggleY, clrSlateGray);
   PanelCheckbox("COST_SWAP","Swap",swapCostsEnabled,PanelX+12,toggleY+PanelFontSize+12,clrForestGreen);
   PanelCheckbox("COST_COMM","Comm",commCostsEnabled,PanelX+12+toggleColumn,toggleY+PanelFontSize+12,clrForestGreen);
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
   int barCount = iBars(_Symbol, _Period);
   if(!force && !firstDraw && fromTime == lastFrom && toTime == lastTo && barCount == lastBarCount) return;
   DeletePrefixed();
   ArrayResize(outcomeLabelX, 0);
   ArrayResize(outcomeLabelY, 0);
   ArrayResize(outcomeLabelW, 0);
   ArrayResize(outcomeLabelH, 0);
   outcomeFontReady = false;
   outcomeChartWidth = (int)ChartGetInteger(0, CHART_WIDTH_IN_PIXELS, 0);
   outcomeChartHeight = (int)ChartGetInteger(0, CHART_HEIGHT_IN_PIXELS, 0);
   historyGapTrades = 0;
   ArrayResize(panelAnalysts, 0);
   int total = 0, tpCount = 0, slCount = 0, drawn = 0;
   double profitPips=0,lossPips=0,netR=0,sumRR=0,netDollar=0,netPips=0,swapTotal=0,commTotal=0;
   datetime firstWib = 0, lastWib = 0;
   // Data are sorted by Excel order; draw oldest to newest so the later trade remains readable.
   for(int i = 0; i < ArraySize(raw); i++) {
      TRADE_REC tr;
      if(!ParseTrade(i, tr) || !MatchesFilters(tr)) continue;
      RememberPanelAnalyst(tr.analyst);
      if(!tr.cancelled) {
      total++;
      double pipSize = 0.1;
      string symbol = Upper(tr.symbol);
      if(StringFind(symbol, "XAG") == 0 || StringFind(symbol, "JPY") >= 0) pipSize = 0.01;
      else if(StringFind(symbol, "XAU") != 0 && StringLen(symbol) == 6) pipSize = 0.0001;
      double risk = MathAbs(tr.entry - tr.sl);
      double fees=(swapCostsEnabled?tr.swapDollar:0)+(commCostsEnabled?tr.commDollar:0);
      double tradeNet=tr.grossDollar-fees;netDollar+=tradeNet;
      netPips+=tr.pips-(tr.lot*tr.dollarPerPip>0?fees/(tr.lot*tr.dollarPerPip):0);
      swapTotal+=swapCostsEnabled?tr.swapDollar:0;commTotal+=commCostsEnabled?tr.commDollar:0;
      if(risk>0){netR+=tr.riskDollar>0?tradeNet/tr.riskDollar:tr.pips*pipSize/risk;sumRR+=MathAbs(tr.tp-tr.entry)/risk;}
      if(tr.pips > 0.0) { tpCount++; profitPips += tr.pips; } else { slCount++; lossPips += tr.pips; }
      }
      datetime rangeStart = tr.cancelled ? tr.createdWIB : tr.openedWIB;
      if(firstWib == 0 || rangeStart < firstWib) firstWib = rangeStart;
      if(lastWib == 0 || tr.closedWIB > lastWib) lastWib = tr.closedWIB;
      if(!TradeCategoryVisible(tr)) continue;
      if(!IsVisible(tr, fromTime, toTime)) continue;
      if(!HasChartCandle(tr.createdServer) || !HasChartCandle(tr.entryServer) || !HasChartCandle(tr.closedServer)) { historyGapTrades++; continue; }
      if(MaximumTradesPerRefresh > 0 && drawn >= MaximumTradesPerRefresh) continue;
      DrawTrade(tr);
      drawn++;
   }
   DrawPanel(total, tpCount, slCount, profitPips, lossPips, firstWib, lastWib, netR, total > 0 ? sumRR/total : 0,netDollar,netPips,swapTotal,commTotal);
   lastFrom = fromTime;
   lastTo = toTime;
   lastBarCount = barCount;
   firstDraw = false;
   ChartRedraw(0);
}

int OnInit() {
   prefix = "FTHRR_" + IntegerToString(GetTickCount()) + "_";
   originalChartForeground=ChartGetInteger(0,CHART_FOREGROUND);foregroundCaptured=true;
   if(ShowInfoPanel)ChartSetInteger(0,CHART_FOREGROUND,false);
   swapCostsEnabled=IncludeSwap;commCostsEnabled=IncludeComm;
   tpTradesVisible = ShowTradeTP;
   slTradesVisible = ShowTradeSL;
   cancelledTradesVisible = ShowTradeCancelled;
   EventSetTimer(1);
   Redraw(true);
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason) {
   EventKillTimer();
   DeletePrefixed();
   if(foregroundCaptured)ChartSetInteger(0,CHART_FOREGROUND,originalChartForeground);
}

void OnTimer() { Redraw(false); }

void OnChartEvent(const int id, const long &lparam, const double &dparam, const string &sparam) {
   if(id == CHARTEVENT_OBJECT_CLICK) {
      bool changed = true;
      if(sparam == prefix + "FILTER_TP" || sparam == prefix + "FILTER_TP_TEXT") tpTradesVisible = !tpTradesVisible;
      else if(sparam == prefix + "FILTER_SL" || sparam == prefix + "FILTER_SL_TEXT") slTradesVisible = !slTradesVisible;
      else if(sparam == prefix + "FILTER_CANCELLED" || sparam == prefix + "FILTER_CANCELLED_TEXT") cancelledTradesVisible = !cancelledTradesVisible;
      else if(sparam==prefix+"COST_SWAP" || sparam==prefix+"COST_SWAP_TEXT")swapCostsEnabled=!swapCostsEnabled;
      else if(sparam==prefix+"COST_COMM" || sparam==prefix+"COST_COMM_TEXT")commCostsEnabled=!commCostsEnabled;
      else changed = false;
      if(changed) { Redraw(true); return; }
   }
   if(id==CHARTEVENT_CHART_CHANGE){if(ShowInfoPanel && ChartGetInteger(0,CHART_FOREGROUND))ChartSetInteger(0,CHART_FOREGROUND,false);Redraw(true);}
}

int OnCalculate(const int rates_total, const int prev_calculated, const datetime &time[], const double &open[], const double &high[], const double &low[], const double &close[], const long &tick_volume[], const long &volume[], const int &spread[]) {
   if(firstDraw) Redraw(true);
   return(rates_total);
}
