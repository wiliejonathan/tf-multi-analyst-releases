using System;
using System.IO;
using System.Text;
using System.Windows.Forms;
using Microsoft.Win32;
using System.Web.Script.Serialization;
class Installer {
 [STAThread] static void Main() {
  if(MessageBox.Show("Pasang / perbarui TF Indicator Compiler untuk akun Windows ini? Komponen ini menghubungkan plugin TF dengan MetaEditor lokal. Tidak memerlukan Administrator.","TF Indicator Compiler",MessageBoxButtons.YesNo,MessageBoxIcon.Question)!=DialogResult.Yes)return;
  try {
   string dir=Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"TFAnalyzerAnalyst","IndicatorCompiler");Directory.CreateDirectory(dir);
   string exe=Path.Combine(dir,"TFIndicatorCompiler.exe"),manifest=Path.Combine(dir,"com.tfanalyst.indicator_compiler.json");
   using(var input=typeof(Installer).Assembly.GetManifestResourceStream("compiler"))using(var output=File.Create(exe))input.CopyTo(output);
   var record=new {name="com.tfanalyst.indicator_compiler",description="TF Analyst local MetaEditor compiler",path=exe,type="stdio",allowed_origins=new[]{"chrome-extension://ecmcgemakncajgbglkggibjgmochancm/"}};
   File.WriteAllText(manifest,new JavaScriptSerializer().Serialize(record),new UTF8Encoding(false));
   using(var key=Registry.CurrentUser.CreateSubKey(@"Software\Google\Chrome\NativeMessagingHosts\com.tfanalyst.indicator_compiler"))key.SetValue("",manifest);
   MessageBox.Show("Compiler terpasang. Kembali ke plugin, lalu klik Cek koneksi. Instal dan buka MT4/MT5 setidaknya sekali agar MetaEditor terdeteksi.","TF Indicator Compiler",MessageBoxButtons.OK,MessageBoxIcon.Information);
  } catch(Exception ex){MessageBox.Show("Pemasangan belum selesai: "+ex.Message,"TF Indicator Compiler",MessageBoxButtons.OK,MessageBoxIcon.Error);}
 }
}