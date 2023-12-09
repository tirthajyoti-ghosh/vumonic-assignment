import React, {useRef} from 'react';
import {View} from 'react-native';
import WebView from 'react-native-webview';

const App = () => {
  const webViewRef = useRef<WebView>(null);

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
      />
    </View>
  );
};

export default App;
