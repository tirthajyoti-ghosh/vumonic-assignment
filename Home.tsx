import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const checkLogin = async () => {
            const appPassword = await AsyncStorage.getItem('APP_PASSWORD');
            if (appPassword) {
                navigation.navigate('Dashboard');
            }
            setLoading(false);
        };

        checkLogin();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#1d3557" />
            ) : (
                <Button title="Login" onPress={() => navigation.navigate('Login')} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 24,
    },
});

export default Home;
