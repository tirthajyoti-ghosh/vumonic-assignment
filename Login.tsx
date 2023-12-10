import React, { useEffect, useRef, useState } from 'react';
import { Animated, Button, Modal, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';
import WebView, { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import SlidingUpPanel from 'rn-sliding-up-panel';


const TWO_FACTOR_DISABLED = 'TWO_FACTOR_DISABLED';
const TWO_FACTOR_ENABLED = 'TWO_FACTOR_ENABLED';

const App = () => {
    const webViewRef = useRef<WebView>(null);
    const [show2FAInstructions, setShow2FAInstructions] = useState(false);
    const [showAppPasswordInstructions, setShowAppPasswordInstructions] = useState(false);
    const [appPassword, setAppPassword] = useState('');
    const twoFAInstructionPanel = useRef<SlidingUpPanel | null>(null);
    const appPasswordsInstructionPanel = useRef<SlidingUpPanel | null>(null);
    const dragValue = useRef(new Animated.Value(50)).current;

    const navigateTo2FA = () => {
        twoFAInstructionPanel.current?.hide();

        webViewRef.current?.injectJavaScript(
            "window.location.href = 'https://myaccount.google.com/signinoptions/two-step-verification/enroll-welcome';",
        );
    };

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
        const isAppPasswordsPage = newNavState.url.startsWith('https://myaccount.google.com/apppasswords');
        const isGoogleAccountPage =
            newNavState.url.indexOf('myaccount.google.com') !== -1 &&
            newNavState.url.indexOf('apppasswords') === -1 &&
            newNavState.url.indexOf('two-step-verification') === -1;
        const is2FASettingsPage =
            newNavState.url.indexOf('two-step-verification') !== -1 && newNavState.url.indexOf('enroll-welcome') === -1;

        if (isAppPasswordsPage) {
            setShowAppPasswordInstructions(true);

            webViewRef.current?.injectJavaScript(`
                document.onload = function() {
                    var appNameInputs = document.querySelectorAll('input[type=text]');
                    if (!appNameInputs || appNameInputs.length !== 2) {
                        window.ReactNativeWebView.postMessage('${TWO_FACTOR_DISABLED}');
                    } else if (appNameInputs && appNameInputs.length === 2) {
                        window.ReactNativeWebView.postMessage('${TWO_FACTOR_ENABLED}');
                    }
                };
            `);
        } else if (isGoogleAccountPage) {
            webViewRef.current?.injectJavaScript("window.location.href = 'https://myaccount.google.com/apppasswords';");
        } else if (is2FASettingsPage) {
            webViewRef.current?.injectJavaScript(`
                window.location.href = 'https://myaccount.google.com/apppasswords';
            `);
            setShow2FAInstructions(false);
            setShowAppPasswordInstructions(true);
        }
    };

    const handleMessage = (event: WebViewMessageEvent) => {
        if (event.nativeEvent.data === TWO_FACTOR_DISABLED) {
            setShow2FAInstructions(true);
        } else if (event.nativeEvent.data === TWO_FACTOR_ENABLED) {
            setShow2FAInstructions(false);
            setShowAppPasswordInstructions(true);
        }
    };

    const handleDoneClick = async () => {
        if (appPassword) {
            // await AsyncStorage.setItem('APP_PASSWORD', appPassword);
            console.log('-----------------------------App Password----------------------');
            console.log(appPassword);
            setShowAppPasswordInstructions(false);
            // TODO
            // TODO
            // TODO
            // TODO
            // TODO: Navigate to the next screen
            // TODO
            // TODO
            // TODO
            // TODO
            // TODO
        } else {
            ToastAndroid.show('Please enter your App Password', ToastAndroid.SHORT);
        }
    };

    useEffect(() => {
        Animated.timing(dragValue, {
            toValue: show2FAInstructions ? 400 : 50,
            duration: 300,
            useNativeDriver: true,
        }).start();

        if (show2FAInstructions) {
            twoFAInstructionPanel.current?.show();
        }
        if (showAppPasswordInstructions) {
            appPasswordsInstructionPanel.current?.show();
        }
    }, [show2FAInstructions, showAppPasswordInstructions]);

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    height: 70,
                    backgroundColor: '#1d3557',
                    justifyContent: 'center',
                    paddingLeft: 20,
                }}>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Google Login</Text>
            </View>
            <WebView
                ref={webViewRef}
                source={{ uri: 'https://accounts.google.com/' }}
                style={{ flex: 1 }}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                onLoad={handleLoad}
                onMessage={handleMessage}
                onNavigationStateChange={handleNavChange}
            />
            {show2FAInstructions && (
                <SlidingUpPanel
                    ref={twoFAInstructionPanel}
                    draggableRange={{ top: 400, bottom: 50 }}
                    showBackdrop
                    animatedValue={dragValue}>
                    <View style={styles.panel}>
                        <Text style={styles.panelTitle}>Two-Factor Authentication is Disabled</Text>
                        <Text style={styles.panelSubtitle}>
                            To obtain App Passwords, enable Two-Factor Authentication (2FA). Follow the steps below:
                        </Text>
                        <Text style={styles.panelStep}>1. Open your Gmail app and go to "Settings".</Text>
                        <Text style={styles.panelStep}>
                            2. Select your account and tap on "Manage your Google Account".
                        </Text>
                        <Text style={styles.panelStep}>
                            3. Navigate to "Security" and find "Two-Factor Authentication". Follow the on-screen
                            instructions to enable it.
                        </Text>
                        <Button onPress={navigateTo2FA} title="Go to 2FA settings" color="#2196F3" />
                    </View>
                </SlidingUpPanel>
            )}
            {showAppPasswordInstructions && (
                <SlidingUpPanel
                    ref={appPasswordsInstructionPanel}
                    draggableRange={{ top: 500, bottom: 65 }}
                    showBackdrop
                    animatedValue={dragValue}
                >
                    <View style={styles.panel}>
                        <Text style={styles.panelTitle}>Generate App Password</Text>
                        <Text style={styles.panelSubtitle}>
                            Now you can generate an App Password. Follow the steps below:
                        </Text>
                        <Text style={styles.panelStep}>
                            1. In the above page, type your app's name in the input field under "App passwords".
                        </Text>
                        <Text style={styles.panelStep}>2. Click on "Create".</Text>
                        <Text style={styles.panelStep}>3. Copy the generated password.</Text>
                        <Text style={styles.panelStep}>4. Paste the password in the field below:</Text>
                        <TextInput
                            style={styles.panelInput}
                            value={appPassword}
                            onChangeText={setAppPassword}
                            placeholder="Paste your App Password here"
                        />
                        <Text style={styles.panelStep}>5. Once done, click on the "Done" button:</Text>
                        <View style={styles.buttonContainer}>
                            <Button title="Done" onPress={handleDoneClick} color="#4a90e2" />
                        </View>
                    </View>
                </SlidingUpPanel>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    panel: {
        flex: 1,
        backgroundColor: '#1d3557',
        position: 'relative',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#e0e0e0',
    },
    panelSubtitle: {
        fontSize: 16,
        marginBottom: 30,
        color: '#e0e0e0',
    },
    panelStep: {
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 15,
        paddingLeft: 10,
        color: '#e0e0e0',
    },
    panelInput: {
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        padding: 10,
        marginLeft: 25,
        marginRight: 25,
        marginVertical: 10,
        backgroundColor: '#1d3557',
        color: '#e0e0e0',
    },
    buttonContainer: {
        marginTop: 10,
        backgroundColor: '#4a90e2',
        borderRadius: 5,
        overflow: 'hidden',
    },
});

export default App;
