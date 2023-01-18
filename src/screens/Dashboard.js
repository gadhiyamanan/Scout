import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useNetInfo } from '@react-native-community/netinfo';
import { cameraIcon, galleryIcon } from '../assets/icons';
import { logoImage } from '../assets/images';
import CTActionSheet from '../components/ActionSheet';
import CustomButton from '../components/Button';
import colors from '../constants/colors';
import Api from '../utils/Api';
import { cameraPicker, photoPicker } from '../utils/compressImagePicker';
import { ASYNC_KEY, mediaOption } from '../utils/constants';

export default function Dashboard({ navigation }) {
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isActionVisible, setIsActionVisible] = useState(false);
    const scrollRef = useRef();
    const [coordinates, setCoordinates] = useState({ lat: '', lang: '' });
    const [description, setDescription] = useState('');
    const [diameter, setDiameter] = useState('');
    const netInfo = useNetInfo();

    const onPhotoPicker = async option => {
        if (option === mediaOption.camera) {
            let res = await cameraPicker({ height: 1000, width: 1000 });
            if (res.status) {
                setImage(res.data);
            } else {
                if (res?.message == 'User did not grant camera permission.')
                    alert(res?.message);
            }
        } else if (option === mediaOption.gallery) {
            let res = await photoPicker({ height: 1000, width: 1000 });
            if (res.status) {
                setImage(res.data);
            } else {
                if (res?.message == 'User did not grant camera permission.')
                    alert(res?.message);
            }
        }
        setIsActionVisible(false);
    };

    const onSubmit = async () => {
        if (!image) return alert('Please select or take an picture of tree');
        if (!description) return alert('Please enter description');
        if (!diameter) return alert('Please enter diameter of tree');
        if (!coordinates.lat || !coordinates.lang)
            return alert('Please select location');

        const request = {
            webcam: { uri: image.uri, name: image.name, type: image.type },
            description: description,
            diameter: diameter,
            latitude: coordinates.lat,
            longitude: coordinates.lang,
        };
        await AsyncStorage.getItem(ASYNC_KEY).then(async result => {
            if (result) {
                const parseArray = JSON.parse(result);
                parseArray.push(request);
                await AsyncStorage.setItem(ASYNC_KEY, JSON.stringify(parseArray))
            } else {
                await AsyncStorage.setItem(ASYNC_KEY, JSON.stringify([request]))
            }
        });
        if (!netInfo.isConnected) {
            alert("Details not submitted and will try once you are online")
            navigation.replace('intro')
            return;
        }

        setIsLoading(true);

        Api.POST('upload.php', { webcam: request.webcam })
            .then(response => {
                Api.GET(
                    `updateDB.php?description=${description}&diameter=${diameter}&latitude=${coordinates.lat}&longitude=${coordinates.lang}&PictureName=${response}`,
                )
                    .then(async () => {
                        await AsyncStorage.getItem(ASYNC_KEY).then(result => {
                            if (result) {
                                const parseArray = JSON.parse(result);
                                const filteredArray = parseArray.filter(item => String(item) !== String(request))
                                AsyncStorage.setItem(ASYNC_KEY, JSON.stringify(filteredArray)).then(() => { navigation.replace('intro'); alert("Details submitted successfully") }
                                );
                            }
                        });
                        setIsLoading(false);
                    })
                    .catch(error => {
                        alert(error.message);
                        setIsLoading(false);
                    });
            })
            .catch(error => {
                alert(error.message);
                setIsLoading(false);
            });
    };

    const onGetCoordinates = () => {
        request(
            Platform.OS === 'ios'
                ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ).then(status => {
            if (status === RESULTS.BLOCKED)
                return alert('Please allow permission from settings');
            Geolocation.getCurrentPosition(data => {
                setCoordinates({
                    lat: data.coords.latitude,
                    lang: data.coords.longitude,
                });
            });
        });
    };

    const photoChooserOption = [
        {
            title: 'Take a picture',
            onPress: () => onPhotoPicker(mediaOption.camera),
            icon: cameraIcon,
        },
        {
            title: 'Choose from gallery',
            icon: galleryIcon,
            onPress: () => onPhotoPicker(mediaOption.gallery),
        },
    ];

    return (
        <>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS == 'ios' ? 'padding' : ''}
                    style={styles.container}>
                    <ScrollView
                        ref={scrollRef}
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}>
                        <Image source={logoImage} style={styles.logoImage} />

                        <View style={styles.space} />
                        <Text style={styles.title}>Picture of tree</Text>
                        <View style={styles.smallSpace} />
                        {!!image ? (
                            <TouchableOpacity onPress={() => setIsActionVisible(true)}>
                                <Image source={{ uri: image.uri }} style={styles.logoImage} />
                            </TouchableOpacity>
                        ) : (
                            <CustomButton
                                title="Click select or take picture"
                                titleStyle={{ fontSize: 13, fontWeight: 'normal' }}
                                onPress={() => setIsActionVisible(true)}
                            />
                        )}

                        <View style={styles.space} />
                        <Text style={styles.title}>Description of tree</Text>
                        <View style={styles.smallSpace} />
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            style={styles.descriptionTextInput}
                            multiline
                            onFocus={() =>
                                scrollRef.current.scrollTo({ x: 0, y: 150, animated: true })
                            }
                        />

                        <View style={styles.space} />
                        <Text style={styles.title}>Approx Diameter of tree</Text>
                        <View style={styles.smallSpace} />
                        <TextInput
                            value={diameter}
                            onChangeText={setDiameter}
                            style={styles.diameterTextInput}
                            keyboardType="decimal-pad"
                            returnKeyType="done"
                        />

                        <View style={styles.space} />
                        <Text style={styles.title}>Location of tree</Text>
                        <View style={styles.smallSpace} />
                        <CustomButton
                            title="Click to obtain coordinates"
                            titleStyle={{ fontSize: 13, fontWeight: 'normal' }}
                            onPress={onGetCoordinates}
                        />
                        <View style={styles.smallSpace} />
                        <Text style={[styles.latLang]}>Latitude: {coordinates.lat}</Text>
                        <Text style={[styles.latLang]}>Longitude: {coordinates.lang}</Text>

                        <View style={styles.space} />
                        <CustomButton
                            isLoading={isLoading}
                            title="Submit"
                            onPress={onSubmit}
                        // onPress={() => navigation.replace('intro')}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
            <CTActionSheet
                onCancelPress={() => setIsActionVisible(false)}
                isVisible={isActionVisible}
                data={photoChooserOption}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    logoImage: {
        width: '80%',
        aspectRatio: 1,
        resizeMode: 'contain',
    },
    scroll: {
        paddingHorizontal: 25,
    },
    scrollContainer: {
        paddingVertical: 20,
        alignItems: 'center',
        flexGrow: 1,
    },
    space: {
        height: 35,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    smallSpace: {
        height: 10,
    },
    descriptionTextInput: {
        borderWidth: 1,
        borderColor: colors.black,
        width: '100%',
        height: 150,
        padding: 10,
        fontSize: 17,
    },
    diameterTextInput: {
        borderWidth: 1,
        borderColor: colors.black,
        width: '100%',
        padding: 10,
        fontSize: 17,
    },
    latLang: {
        fontSize: 15,
        alignSelf: 'flex-start',
    },
});
