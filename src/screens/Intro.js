import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { logoImage } from '../assets/images';
import CustomButton from '../components/Button';
import colors from '../constants/colors';

export default function Intro({ navigation }) {
    return (
        <View style={styles.container}>
            <Image source={logoImage} style={styles.logoImage} />
            <View style={styles.space} />
            <Text style={styles.appName}>Sawyer Application</Text>
            <View style={styles.space} />
            <CustomButton title="Enter Fallen Tree" onPress={() => navigation.replace("dashboard")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    logoImage: {
        width: '60%',
        height: 100,
        resizeMode: 'contain',
    },
    appName: {
        fontSize: 20,
        fontWeight: "bold"
    },
    space: {
        height: 35
    }
});
