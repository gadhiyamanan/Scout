import React from 'react';
import { StatusBar } from 'react-native';
import MainStack from './navigation';

export default function index() {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <MainStack />
        </>
    );
}
