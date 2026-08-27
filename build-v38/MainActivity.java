package com.skillfusion.tfmultianalystmobil3;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import java.io.OutputStream;

public class MainActivity extends Activity {
    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private static final int FILE_CHOOSER_REQUEST = 9011;
    private static final int SAVE_FILE_REQUEST = 9012;
    private static final int NOTIFICATION_PERMISSION_REQUEST = 9013;
    private byte[] pendingSaveBytes;
    private String pendingSaveName;
    private String pendingSaveMime;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        configureSystemBars();
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(2, 6, 23));
        setContentView(webView);
        configureSystemBars();

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true); s.setAllowContentAccess(true); s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false); s.setLoadWithOverviewMode(false); s.setUseWideViewPort(false);
        s.setTextZoom(100); s.setSupportMultipleWindows(false); s.setMediaPlaybackRequiresUserGesture(true);

        webView.addJavascriptInterface(new AndroidSaveBridge(), "AndroidSave");
        webView.addJavascriptInterface(new RemoteProgressBridge(), "AndroidRemoteProgress");
        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl(); String scheme = uri.getScheme();
                if ("file".equalsIgnoreCase(scheme)) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); } catch (Exception ignored) {}
                return true;
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> cb, FileChooserParams params) {
                if (filePathCallback != null) filePathCallback.onReceiveValue(null);
                filePathCallback = cb;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "text/json", "text/plain", "application/octet-stream"});
                intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                try { startActivityForResult(intent, FILE_CHOOSER_REQUEST); return true; }
                catch (Exception e) { filePathCallback = null; return false; }
            }
        });
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    private void configureSystemBars() {
        Window window = getWindow();
        window.setStatusBarColor(Color.rgb(2, 6, 23));
        window.setNavigationBarColor(Color.rgb(2, 6, 23));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowInsetsController c = window.getInsetsController();
            if (c != null) {
                c.setSystemBarsAppearance(0, WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
                c.hide(WindowInsets.Type.navigationBars());
                c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            window.getDecorView().setSystemUiVisibility(flags);
        }
    }

    @Override public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) configureSystemBars();
    }

    public class AndroidSaveBridge {
        @JavascriptInterface public void saveBase64(final String fileName, final String mimeType, final String base64Data) {
            runOnUiThread(() -> {
                try {
                    pendingSaveBytes = Base64.decode(base64Data, Base64.DEFAULT);
                    pendingSaveName = (fileName == null || fileName.trim().isEmpty()) ? "export.bin" : fileName;
                    pendingSaveMime = (mimeType == null || mimeType.trim().isEmpty()) ? "application/octet-stream" : mimeType;
                    Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType(pendingSaveMime);
                    intent.putExtra(Intent.EXTRA_TITLE, pendingSaveName);
                    startActivityForResult(intent, SAVE_FILE_REQUEST);
                } catch (Exception e) {
                    pendingSaveBytes = null;
                    Toast.makeText(MainActivity.this, "Gagal menyiapkan file: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }
            });
        }
    }

    public class RemoteProgressBridge {
        @JavascriptInterface public void startOrUpdate(final String email, final String token, final String licenseId, final String sessionToken, final int percent, final String detail) {
            runOnUiThread(() -> {
                try {
                    if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                        requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_PERMISSION_REQUEST);
                    }
                    Intent intent = new Intent(MainActivity.this, RemoteProgressService.class);
                    intent.setAction(RemoteProgressService.ACTION_START_OR_UPDATE);
                    intent.putExtra("email", email); intent.putExtra("token", token); intent.putExtra("licenseId", licenseId); intent.putExtra("sessionToken", sessionToken);
                    intent.putExtra("percent", Math.max(0, Math.min(100, percent))); intent.putExtra("detail", detail == null ? "" : detail);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) startForegroundService(intent); else startService(intent);
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Progress notification gagal: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        }
        @JavascriptInterface public void stop() {
            runOnUiThread(() -> {
                try { Intent i = new Intent(MainActivity.this, RemoteProgressService.class); i.setAction(RemoteProgressService.ACTION_STOP); startService(i); } catch (Exception ignored) {}
            });
        }
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == SAVE_FILE_REQUEST) {
            if (resultCode == RESULT_OK && data != null && data.getData() != null && pendingSaveBytes != null) {
                try (OutputStream out = getContentResolver().openOutputStream(data.getData(), "w")) {
                    if (out == null) throw new Exception("Storage tidak dapat dibuka");
                    out.write(pendingSaveBytes); out.flush();
                    Toast.makeText(this, "File tersimpan: " + pendingSaveName, Toast.LENGTH_LONG).show();
                    if (webView != null) webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('tf-native-save-complete'))", null);
                } catch (Exception e) { Toast.makeText(this, "Gagal menyimpan file: " + e.getMessage(), Toast.LENGTH_LONG).show(); }
            }
            pendingSaveBytes = null; pendingSaveName = null; pendingSaveMime = null; configureSystemBars(); return;
        }
        if (requestCode == FILE_CHOOSER_REQUEST) {
            Uri[] result = null;
            if (resultCode == RESULT_OK && data != null) {
                if (data.getClipData() != null) {
                    int count = data.getClipData().getItemCount(); result = new Uri[count];
                    for (int i = 0; i < count; i++) result[i] = data.getClipData().getItemAt(i).getUri();
                } else if (data.getData() != null) result = new Uri[]{data.getData()};
            }
            if (filePathCallback != null) { filePathCallback.onReceiveValue(result); filePathCallback = null; }
            configureSystemBars(); return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override protected void onResume() { super.onResume(); configureSystemBars(); }
    @Override public void onBackPressed() { if (webView != null && webView.canGoBack()) webView.goBack(); else super.onBackPressed(); }
}
