package com.skillfusion.tfmultianalystmobil3;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class RemoteProgressService extends Service {
    public static final String ACTION_START_OR_UPDATE = "TF_REMOTE_PROGRESS_START_UPDATE";
    public static final String ACTION_STOP = "TF_REMOTE_PROGRESS_STOP";
    private static final String CHANNEL_ID = "tf_remote_scan_progress";
    private static final int NOTIFICATION_ID = 23801;
    private static final String API = "https://tf-license-device-api.wiliejonathan1999.workers.dev/remote/mobile-status";
    private volatile boolean running = false;
    private volatile String email="", token="", licenseId="", sessionToken="", detail="Batch scanning berjalan…";
    private volatile int percent=0;

    @Override public void onCreate() { super.onCreate(); createChannel(); }
    @Override public IBinder onBind(Intent intent) { return null; }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_STOP.equals(intent.getAction())) { stopNow(); return START_NOT_STICKY; }
        if (intent != null) {
            email = safe(intent.getStringExtra("email")); token = safe(intent.getStringExtra("token")); licenseId = safe(intent.getStringExtra("licenseId")); sessionToken = safe(intent.getStringExtra("sessionToken"));
            percent = clamp(intent.getIntExtra("percent", percent)); detail = safeDetail(intent.getStringExtra("detail"));
        }
        startForeground(NOTIFICATION_ID, buildNotification(percent, detail));
        if (!running) { running = true; new Thread(this::pollLoop, "tf-remote-progress").start(); }
        return START_NOT_STICKY;
    }

    private void pollLoop() {
        int consecutiveErrors=0;
        while (running) {
            try {
                JSONObject state = fetchStatus();
                if (state != null && state.optBoolean("valid", true)) {
                    JSONObject snapshot = state.optJSONObject("snapshot");
                    JSONObject progress = snapshot == null ? null : snapshot.optJSONObject("progress");
                    if (progress != null) {
                        boolean active = progress.optBoolean("inProgress", false);
                        percent = clamp(progress.optInt("percent", percent));
                        String d = progress.optString("detail", detail); if (!d.trim().isEmpty()) detail=safeDetail(d);
                        notifyNow(percent, detail);
                        consecutiveErrors=0;
                        if (!active) { if (percent >= 100) notifyNow(100, "Batch scanning selesai."); try { Thread.sleep(1000); } catch(Exception ignored){} stopNow(); break; }
                    }
                }
            } catch (Exception e) { consecutiveErrors++; if (consecutiveErrors >= 5) notifyNow(percent, "Koneksi Remote tersendat • progress terakhir " + percent + "%"); }
            try { Thread.sleep(1800); } catch (InterruptedException e) { break; }
        }
    }

    private JSONObject fetchStatus() throws Exception {
        if (email.isEmpty() || token.isEmpty() || sessionToken.isEmpty()) return null;
        URL u=new URL(API); HttpURLConnection c=(HttpURLConnection)u.openConnection(); c.setRequestMethod("POST"); c.setConnectTimeout(8000); c.setReadTimeout(8000); c.setDoOutput(true); c.setRequestProperty("Content-Type","application/json");
        JSONObject body=new JSONObject(); body.put("email",email); body.put("token",token); body.put("licenseId",licenseId); body.put("sessionToken",sessionToken); body.put("deviceType","MOBILE"); body.put("clientType","MOBILE"); body.put("mobileVersion","1.0.38"); body.put("remoteRevision","REV238");
        byte[] bytes=body.toString().getBytes(StandardCharsets.UTF_8); try(OutputStream out=c.getOutputStream()){out.write(bytes);} int code=c.getResponseCode(); BufferedReader r=new BufferedReader(new InputStreamReader(code>=200&&code<400?c.getInputStream():c.getErrorStream(),StandardCharsets.UTF_8)); StringBuilder sb=new StringBuilder(); String line; while((line=r.readLine())!=null)sb.append(line); r.close(); c.disconnect(); return new JSONObject(sb.toString());
    }

    private void createChannel() { if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) { NotificationChannel ch=new NotificationChannel(CHANNEL_ID,"TF Analyzer Batch Progress",NotificationManager.IMPORTANCE_LOW); ch.setDescription("Progress batch scanning Remote"); ch.setShowBadge(false); ((NotificationManager)getSystemService(NOTIFICATION_SERVICE)).createNotificationChannel(ch); } }
    private Notification buildNotification(int pct,String text) { Intent open=new Intent(this,MainActivity.class); open.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP|Intent.FLAG_ACTIVITY_CLEAR_TOP); PendingIntent pi=PendingIntent.getActivity(this,238,open,Build.VERSION.SDK_INT>=23?PendingIntent.FLAG_IMMUTABLE|PendingIntent.FLAG_UPDATE_CURRENT:PendingIntent.FLAG_UPDATE_CURRENT); Notification.Builder b=Build.VERSION.SDK_INT>=26?new Notification.Builder(this,CHANNEL_ID):new Notification.Builder(this); b.setSmallIcon(com.skillfusion.tfmultianalystmobil3.R.drawable.tf_icon).setContentTitle("TF Analyzer • Batch Scanning").setContentText(safeDetail(text)).setOngoing(true).setOnlyAlertOnce(true).setContentIntent(pi).setProgress(100,clamp(pct),false); if(Build.VERSION.SDK_INT<26)b.setPriority(Notification.PRIORITY_LOW); return b.build(); }
    private void notifyNow(int pct,String text){((NotificationManager)getSystemService(NOTIFICATION_SERVICE)).notify(NOTIFICATION_ID,buildNotification(pct,text));}
    private void stopNow(){running=false;try{stopForeground(true);}catch(Exception ignored){}stopSelf();}
    private static int clamp(int v){return Math.max(0,Math.min(100,v));}
    private static String safe(String s){return s==null?"":s;}
    private static String safeDetail(String s){String v=safe(s).replaceAll("[\\r\\n]+"," ").trim();return v.isEmpty()?"Batch scanning berjalan…":(v.length()>160?v.substring(0,160):v);}
    @Override public void onDestroy(){running=false;super.onDestroy();}
}
