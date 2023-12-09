import React, {useRef, useState} from 'react';
import {Text, View} from 'react-native';
import WebView, {
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';

const TWO_FACTOR_DISABLED = 'TWO_FACTOR_DISABLED';
const TWO_FACTOR_ENABLED = 'TWO_FACTOR_ENABLED';

const App = () => {
  const webViewRef = useRef<WebView>(null);
  const [is2faEnabled, setIs2faEnabled] = useState(false);

  const webViewScript = `
    var emailInput = document.querySelector('input[type=email]');
    if (emailInput) {
      emailInput.focus();
      emailInput.value = 't.ghosh.me@gmail.com';

      // Simulate a 'Next' button click
      var nextButton = document.querySelector('[id="identifierNext"]');
      if (nextButton) {
          nextButton.click();
      }
    }
  `;

  const handleLoad = () => {
    webViewRef.current?.injectJavaScript(webViewScript);
  };

  const handleNavChange = (newNavState: WebViewNavigation) => {
    if (newNavState.url.indexOf('apppasswords') !== -1) {
      webViewRef.current?.injectJavaScript(`
          var appNameInputs = document.querySelectorAll('input[type=text]');
          if (!appNameInputs || appNameInputs.length !== 2) {
            window.ReactNativeWebView.postMessage('${TWO_FACTOR_DISABLED}');
          } else if (appNameInputs && appNameInputs.length === 2) {
            window.ReactNativeWebView.postMessage('${TWO_FACTOR_ENABLED}');
          }
      `);
    } else if (newNavState.url.indexOf('myaccount.google.com') !== -1) {
      webViewRef.current?.injectJavaScript(
        "window.location.href = 'https://myaccount.google.com/apppasswords';",
      );
    }
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    if (event.nativeEvent.data === TWO_FACTOR_DISABLED) {
      setIs2faEnabled(false);
    } else if (event.nativeEvent.data === TWO_FACTOR_ENABLED) {
      setIs2faEnabled(true);
    }
  };

  return (
    <View style={{flex: 1}}>
      <WebView
        ref={webViewRef}
        source={{uri: 'https://accounts.google.com/'}}
        style={{flex: 1}}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onLoad={handleLoad}
        onMessage={handleMessage}
        onNavigationStateChange={handleNavChange}
      />
      {is2faEnabled && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 40, fontWeight: 'bold'}}>2FA is enabled</Text>
        </View>
      )}
    </View>
  );
};

export default App;
