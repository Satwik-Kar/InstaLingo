import { ActivityIndicator, Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import { languagesCodes } from "./languages";
import { throttle } from 'lodash';

const languages = languagesCodes;

export default function Index() {
    const [title, setTitle] = useState("नमस्ते");
    const [strangerLanguageName, setStrangerLanguageName] = useState();
    const [strangerLanguageId, setStrangerLanguageId] = useState("en-US");
    const [languageId, setLanguageId] = useState("en");
    const [languageName, setLanguageName] = useState("english");
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isStrangerLanguageSelected, setIsStrangerLanguageSelected] = useState(false);

    const toggleModal = useCallback(() => {
        setIsModalVisible(prevState => !prevState);
    }, []);

    const throttledDetectLanguage = useCallback(throttle(async () => {
        try {
            setIsLoading(true);
            const options = {
                method: "POST",
                url: "https://microsoft-translator-text.p.rapidapi.com/Detect",
                params: {"api-version": "3.0"},
                headers: {
                    "x-rapidapi-key": "your-api-key",
                    "x-rapidapi-host": "microsoft-translator-text.p.rapidapi.com",
                    "Content-Type": "application/json",
                },
                data: [{ Text: title }],
            };
            const response = await axios.request(options);
            console.log(response.data[0].language);
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

    const handlePressPersonal = useCallback(() => {
        if (!isStrangerLanguageSelected) {
            Alert.alert("Select Language", "Select a language for the stranger first!");
            return;
        }
    }, [isStrangerLanguageSelected]);

    const handlePressStranger = useCallback(() => {
        if (!isStrangerLanguageSelected) {
            Alert.alert("Information", "Select a language for the stranger first!");
            return;
        }
    }, [isStrangerLanguageSelected]);

    const ListItem = React.memo(({ item, onSelect }) => (
        <Pressable onPress={() => onSelect(item.id, item.name)} style={styles.modalItem}>
            <Text style={styles.modalItemText}>{item.name}</Text>
        </Pressable>
    ));

    const renderItem = useCallback(({ item }) => (
        <ListItem item={item} onSelect={handleSelectLanguage} />
    ), [handleSelectLanguage]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.smallContainer}>

                <Pressable style={styles.pressableSelectLanguage} onPress={selectLanguageForStranger}>
                    <Text>{strangerLanguageName || "Select Stranger Language"}</Text>
                </Pressable>
                <Pressable style={styles.pressable} onPressIn={handlePressStranger}>
                    <Text>Hold to speak (STRANGER)</Text>
                </Pressable>
            </View>

            <View>
                {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> :
                    <Text style={styles.title}>{title}</Text>}
            </View>

            <View style={styles.smallContainer}>
                <Pressable style={styles.pressable} onPressIn={handlePressPersonal}>
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
    container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#ffffff" },
    smallContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
    title: { fontSize: 30, fontWeight: "bold", color: "#20232a", textAlign: "center" },
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
    modal: { justifyContent: "flex-end", margin: 0 },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        maxHeight: "50%"
    },
    modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#ccc" },
    modalItemText: { fontSize: 18, textAlign: "center" },
});
