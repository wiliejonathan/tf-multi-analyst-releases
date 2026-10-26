using System;
using System.IO;
using System.Text;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Diagnostics;
using System.Web.Script.Serialization;
using System.Security.Cryptography;

class CompilerHost {
 const string Origin = "chrome-extension://ecmcgemakncajgbglkggibjgmochancm/";
 static JavaScriptSerializer json = new JavaScriptSerializer { MaxJsonLength = 8 * 1024 * 1024 };
 static Stream input = Console.OpenStandardInput(), output = Console.OpenStandardOutput();
 static void Send(object value) {
  byte[] data = Encoding.UTF8.GetBytes(json.Serialize(value));
  byte[] header = BitConverter.GetBytes(data.Length);
  output.Write(header,0,4); output.Write(data,0,data.Length); output.Flush();
 }
 static byte[] Read(int count) {
  byte[] data = new byte[count]; int offset = 0;
  while(offset < count) {int n = input.Read(data,offset,count-offset); if(n==0) throw new EndOfStreamException(); offset += n;}
  return data;
 }
 static string Text(Dictionary<string,object> row, string key, int limit) {
  object value; if(!row.TryGetValue(key,out value) || value == null) return "";
  string text = Convert.ToString(value,CultureInfo.InvariantCulture);
  if(text.Length > limit || text.Any(c => c < 32 || c == ';' || c == '"' || c == '\\')) throw new Exception("Data teks tidak valid.");
  return text;
 }
 static string Number(Dictionary<string,object> row,string key) {
  double value; string text = Text(row,key,40);
  if(!double.TryParse(text,NumberStyles.Float,CultureInfo.InvariantCulture,out value) || double.IsNaN(value) || double.IsInfinity(value) || Math.Abs(value)>1e12) throw new Exception("Harga atau pips tidak valid: " + key);
  return value.ToString("0.########",CultureInfo.InvariantCulture);
 }
 static string Date(Dictionary<string,object> row,string key,bool optional) {
  string text = Text(row,key,25); if(optional && text=="") return "";
  DateTime value;
  if(!DateTime.TryParseExact(text,"yyyy.MM.dd HH:mm",CultureInfo.InvariantCulture,DateTimeStyles.None,out value) || value.Year < 2000 || value.Year > 2100) throw new Exception("Tanggal tidak valid: " + key);
  return text;
 }
 static void Main(string[] args) {
  if(args.Length == 0 || args[0] != Origin) return;
  try {
   int length = BitConverter.ToInt32(Read(4),0);
   if(length <= 0 || length > 8*1024*1024) throw new Exception("Ukuran permintaan tidak valid.");
   var request = json.Deserialize<Dictionary<string,object>>(Encoding.UTF8.GetString(Read(length)));
   string platform = Text(request,"platform",3);
   if(platform != "MT4" && platform != "MT5") throw new Exception("Pilih MT4 atau MT5.");
   var rows = request["rows"] as ArrayList;
   if(rows == null || rows.Count == 0 || rows.Count > 10000) throw new Exception("Pilih 1 sampai 10.000 sinyal.");
   var raw = new StringBuilder();
   int index = 0;
   foreach(object item in rows) {
    var row = item as Dictionary<string,object>; if(row == null) throw new Exception("Format sinyal tidak valid.");
    bool cancelled = Text(row,"status",16) == "Cancelled";
    string created = Date(row,"created",false), opened = Date(row,"opened",cancelled), closed = Date(row,"closed",false);
    string start = opened == "" ? created : opened;
    if(string.CompareOrdinal(start,closed)>0) throw new Exception("Closed At mendahului tanggal mulai.");
    if(index>0) raw.Append(",\n");
    raw.Append('"').Append(++index).Append(';').Append(opened).Append(';').Append(closed).Append(';')
      .Append(Text(row,"analyst",120)).Append(';').Append(Text(row,"side",20)).Append(';').Append(Text(row,"symbol",20)).Append(';')
      .Append(Number(row,"entry")).Append(';').Append(Number(row,"tp")).Append(';').Append(Number(row,"sl")).Append(';')
      .Append(cancelled ? "0" : Number(row,"pips")).Append(";0;").Append(created).Append(';').Append(cancelled ? "Cancelled" : "Closed").Append('"');
   }
   Send(new {type="progress", value=25, message="Data diperiksa. Menyiapkan indikator..."});
   string editor = null, includes = null;
   string dataRoot = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),"MetaQuotes","Terminal");
   if(Directory.Exists(dataRoot)) foreach(string dir in Directory.GetDirectories(dataRoot)) {
    string originFile = Path.Combine(dir,"origin.txt"); if(!File.Exists(originFile)) continue;
    string origin = File.ReadAllText(originFile).Trim().Trim('\uFEFF');
    string candidate = Path.Combine(origin, platform == "MT4" ? "metaeditor.exe" : "MetaEditor64.exe");
    string inc = Path.Combine(dir,platform == "MT4" ? "MQL4" : "MQL5");
    if(File.Exists(candidate) && File.Exists(Path.Combine(inc,"Include","Canvas","Canvas.mqh"))) {editor=candidate; includes=inc;break;}
   }
   if(editor == null) throw new Exception("MetaEditor " + platform + " belum tersedia. Instal terminal dan jalankan sekali sebelum membuat indikator.");
   string folder = Path.Combine(Path.GetTempPath(),"TFIndicatorBuild",Guid.NewGuid().ToString("N")); Directory.CreateDirectory(folder);
   try {
    string name = "TF_RR_" + DateTime.Now.ToString("yyyyMMdd_HHmmss");
    string suffix = platform == "MT4" ? "4" : "5";
    string source = Path.Combine(folder,name + ".mq" + suffix), binary = Path.Combine(folder,name + ".ex" + suffix), log=Path.Combine(folder,"compile.log");
    string template;
    using(var stream = typeof(CompilerHost).Assembly.GetManifestResourceStream("indicator-template")) using(var reader = new StreamReader(stream)) template=reader.ReadToEnd();
    File.WriteAllText(source, template.Replace("@@RAW@@",raw.ToString()),new UTF8Encoding(false));
    Send(new {type="progress",value=50,message="Mengompilasi " + platform + "..."});
    var startInfo = new ProcessStartInfo(editor,"/compile:\""+source+"\" /inc:\""+includes+"\" /log:\""+log+"\"") {UseShellExecute=false,CreateNoWindow=true,WindowStyle=ProcessWindowStyle.Hidden};
    using(var process=Process.Start(startInfo)) {if(!process.WaitForExit(45000)) {try{process.Kill();}catch{} throw new Exception("Kompilasi melewati batas waktu. Coba kembali.");}}
    if(!File.Exists(binary)) {string detail=File.Exists(log)?File.ReadAllText(log):"Tidak ada hasil kompilasi."; throw new Exception("Kompilasi gagal. " + detail.Substring(Math.Max(0,detail.Length-1600)));}
    byte[] bytes = File.ReadAllBytes(binary);
    if(bytes.Length<100 || bytes.Length>32*1024*1024) throw new Exception("Hasil kompilasi tidak valid.");
    for(int offset=0;offset<bytes.Length;offset+=192*1024) Send(new {type="chunk", data=Convert.ToBase64String(bytes,offset,Math.Min(192*1024,bytes.Length-offset))});
    string hash; using(var sha=SHA256.Create()) hash=BitConverter.ToString(sha.ComputeHash(bytes)).Replace("-","").ToLowerInvariant();
    Send(new {type="done",compilerVersion="2.27",filename=Path.GetFileName(binary),size=bytes.Length,sha256=hash});
   } finally {try{Directory.Delete(folder,true);}catch{}}
  } catch(Exception ex) {try{Send(new {type="error",message=ex.Message});}catch{}}
 }
}
