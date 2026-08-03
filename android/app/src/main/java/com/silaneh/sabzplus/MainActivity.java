package com.silaneh.sabzplus;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Disable Android's system-level Autofill Framework for the whole
    // WebView. This is the actual cause of the "meaningless white
    // rectangle" that appeared when tapping form fields (e.g. the store
    // name box on the signup screen) and of values silently jumping
    // between fields: the OS autofill service was intercepting/suggesting
    // over the WebView's inputs. HTML-level `autoComplete="off"` on the
    // <input> elements does NOT stop this — it only affects browser-level
    // autocomplete, not the separate native Android Autofill Framework —
    // which is why that earlier fix alone didn't resolve it.
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      if (bridge != null && bridge.getWebView() != null) {
        bridge.getWebView().setImportantForAutofill(View.IMPORTANT_FOR_AUTOFILL_NO);
      }
    }
  }
}
