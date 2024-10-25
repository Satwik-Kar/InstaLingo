import {ActivityIndicator, Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import {throttle} from 'lodash';
import Voice from '@wdragon/react-native-voice';
import {LanguageUtils} from './LanguageUtil';
import {deepmind_languages} from './deepmind-langs.json';
import {voice_languages} from './voice-languages.json';
import {languagesCodes} from "./languages";

const languages = languagesCodes;

export default function Index() {
    const [title, setTitle] = useState();
    const [recognizedPersonal, setRecognizedPersonal] = useState();
    const [recognizedStranger, setRecognizedStranger] = useState();
    const [isPersonalListening, setIsPersonalListening] = useState(false);

    const [strangerLanguageName, setStrangerLanguageName] = useState();
    const [strangerLanguageId, setStrangerLanguageId] = useState();
    const [languageId, setLanguageId] = useState();
    const [languageName, setLanguageName] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isStrangerLanguageSelected, setIsStrangerLanguageSelected] = useState(false);
    React.useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);
    const onSpeechResults = (event) => {
        const speech = event.value ? event.value[0] : '';
        setRecognizedPersonal(null) && setRecognizedStranger(null);
        isPersonalListening ? setRecognizedPersonal(speech) : setRecognizedStranger(speech);
        throttledTranslateLanguage("or", "en")


    };
    useEffect(() => {
        // Function to get the speech recognition services available on the device
        const fetchSpeechRecognitionServices = async () => {
            try {
                const availableServices = await Voice.getSpeechRecognitionServices();
                console.log('Available Speech Recognition Services: ', availableServices);
            } catch (error) {
                console.error('Error fetching speech recognition services: ', error);
            }
        };

        fetchSpeechRecognitionServices();
    }, []);
    useEffect(() => {
        LanguageUtils.initialize(deepmind_languages, voice_languages);

        const languages = LanguageUtils.getSupportedLanguages();
        console.log(languages);
    }, []);
    const onSpeechError = (event) => {
        console.error('Speech recognition error: ', event.error);
        setIsLoading(false);
    };

    const toggleModal = useCallback(() => {
        setIsModalVisible(prevState => !prevState);
    }, []);

    const throttledTranslateLanguage = useCallback(throttle(async (from, to) => {
        try {
            setIsLoading(true);

            const options = {
                method: 'POST',
                url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2',
                headers: {
                    'x-rapidapi-key': 'b1742526d8msh7a63fb689691a60p13741ajsn6619629c6355',
                    'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
                    'Content-Type': 'application/json'
                },
                data: {
                    q: recognizedPersonal || recognizedStranger,
                    source: from,
                    target: to
                }
            };
            const response = await axios.request(options);

            alert(response.data.data.translations.translatedText);
        } catch (error) {
            console.error("Language detection failed:", error);
            Alert.alert("Error", "Failed to detect language.");
        } finally {
            setIsLoading(false);
        }
    }, 2000), [title]);

    useEffect(() => {
        const loadLanguageSettings = async () => {
            const valueId = await AsyncStorage.getItem("languageId");
            const valueName = await AsyncStorage.getItem("languageName");
            if (valueId && valueName) {
                setLanguageId(valueId);
                setLanguageName(valueName);
            } else {
                toggleModal();
            }
        };

        loadLanguageSettings();
    }, [toggleModal]);

    const handleSelectLanguage = async (languageId, languageName) => {
        if (isStrangerLanguageSelected) {
            setStrangerLanguageId(languageId);
            setStrangerLanguageName(languageName);
        } else {
            setLanguageId(languageId);
            setLanguageName(languageName);
            await AsyncStorage.setItem("languageId", languageId);
            await AsyncStorage.setItem("languageName", languageName);
        }
        setIsModalVisible(false);
    };

    const selectLanguageForStranger = useCallback(() => {
        setIsStrangerLanguageSelected(true);
        toggleModal();
    }, [toggleModal]);

    const handlePressPersonalIn = useCallback(async () => {
        if (!isStrangerLanguageSelected) {
            Alert.alert("Select Language", "Select a language for the stranger first!");
            return;
        }
        setIsLoading(true);
        setIsPersonalListening(true);
        try {
            await Voice.start(languageId);
        } catch (error) {
            console.error('Error starting voice recognition: ', error);
        }


    }, [isStrangerLanguageSelected]);

    const handlePressStrangerOut = useCallback(() => {

    }, [isStrangerLanguageSelected]);

    const handlePressPersonalOut = useCallback(async () => {

        setIsLoading(false);
        setIsPersonalListening(false);
        try {
            await Voice.stop();
        } catch (error) {
            console.error('Error stopping voice recognition: ', error);
        }


    }, [isStrangerLanguageSelected]);

    const handlePressStrangerIn = useCallback(() => {
        if (!isStrangerLanguageSelected) {
            Alert.alert("Information", "Select a language for the stranger first!");
            return;
        }
    }, [isStrangerLanguageSelected]);
    const ListItem = React.memo(({item, onSelect}) => (
        <Pressable onPress={() => onSelect(item.id, item.name)} style={styles.modalItem}>
            <Text style={styles.modalItemText}>{item.name}</Text>
        </Pressable>
    ));

    const renderItem = useCallback(({item}) => (
        <ListItem item={item} onSelect={handleSelectLanguage}/>
    ), [handleSelectLanguage]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.smallContainer}>

                <Pressable style={styles.pressableSelectLanguage} onPress={selectLanguageForStranger}>
                    <Text>{strangerLanguageName || "Select Stranger Language"}</Text>
                </Pressable>
                <Pressable style={styles.pressable} onPressIn={handlePressStrangerIn}
                           onPressOut={handlePressStrangerOut}>
                    <Text>Hold to speak (STRANGER)</Text>
                </Pressable>
            </View>

            <View>
                {isLoading ? <ActivityIndicator size="large" color="#0000ff"/> :
                    <Text style={styles.title}>{recognizedPersonal || recognizedStranger}</Text>}
            </View>

            <View style={styles.smallContainer}>
                <Pressable style={styles.pressable} onPressIn={handlePressPersonalIn}
                           onPressOut={handlePressPersonalOut}>
                    <Text>Hold to speak (PERSONAL)</Text>
                </Pressable>
                <Text style={styles.title}>{languageName}</Text>
            </View>

            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
                <View style={styles.modalContent}>
                    <FlatList
                        data={languages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#ffffff"},
    smallContainer: {flex: 1, alignItems: "center", justifyContent: "center"},
    title: {fontSize: 30, fontWeight: "bold", color: "#20232a", textAlign: "center"},
    pressable: {
        height: 150,
        width: 150,
        backgroundColor: "rgba(65,141,255,0.52)",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    pressableSelectLanguage: {
        height: 50,
        width: 150,
        backgroundColor: "rgba(65,141,255,0.52)",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30
    },
    modal: {justifyContent: "flex-end", margin: 0},
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        maxHeight: "50%"
    },
    modalItem: {paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#ccc"},
    modalItemText: {fontSize: 18, textAlign: "center"},
});
