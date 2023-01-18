import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '../constants/colors';

export default function CustomButton({ title = '', containerStyle, titleStyle, isLoading, ...other }) {
    return (
        <TouchableOpacity style={[styles.container, containerStyle]} {...other} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color={colors.black} /> : <Text style={[styles.title, titleStyle]}>{title}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: colors.black,
        backgroundColor: colors.gray
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    }
});