import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ASYNC_KEY } from '../utils/constants';
import { useNetInfo } from '@react-native-community/netinfo';
import Api from '../utils/Api';
import SplashScreen from 'react-native-splash-screen';
import Intro from '../screens/Intro';
import Dashboard from '../screens/Dashboard';

export default function index() {
    const Stack = createNativeStackNavigator();
    const stackOptions = { headerShown: false };
    const netInfo = useNetInfo();

    React.useEffect(() => {
        if (netInfo.isConnected) {
            syncData();
        }
    }, [netInfo.isConnected]);

    const syncData = async () => {
        AsyncStorage.getItem(ASYNC_KEY).then(result => {
            if (result) {
                const parseArray = JSON.parse(result);
                if (parseArray.length) uploadData(parseArray[0]);
            }
        });
    };

    uploadData = request => {
        if (!request) return;
        Api.POST('upload.php', { webcam: request.webcam })
            .then(response => {
                Api.GET(
                    `updateDB.php?description=${request.description}&diameter=${request.diameter}&latitude=${request.latitude}&longitude=${request.longitude}&PictureName=${response}`,
                )
                    .then(async () => {
                        AsyncStorage.getItem(ASYNC_KEY).then(result => {
                            if (result) {
                                const parseArray = JSON.parse(result);
                                const filteredArray = parseArray.filter(
                                    item => JSON.stringify(item) !== JSON.stringify(request),
                                );
                                AsyncStorage.setItem(
                                    ASYNC_KEY,
                                    JSON.stringify(filteredArray),
                                ).then(() => syncData());
                            }
                        });
                    })
                    .catch(error => {
                        console.error(error.message);
                    });
            })
            .catch(error => {
                console.error(error.message);
            });
    };

    return (
        <NavigationContainer onReady={() => SplashScreen.hide()}>
            <Stack.Navigator>
                <Stack.Screen name="intro" component={Intro} options={stackOptions} />
                <Stack.Screen
                    name="dashboard"
                    component={Dashboard}
                    options={stackOptions}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
