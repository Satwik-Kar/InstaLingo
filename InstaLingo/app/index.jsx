import {ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from "react";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from 'react-native-modal'; // Import Modal from react-native-modal


export default function Index() {
    const [title, setTitle] = useState("नमस्ते");
    const [detectedLanguage, setDetectedLanguage] = useState('en');
    const [languageId, setLanguageId] = useState('en');
    const [languageName, setLanguageName] = useState('english');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const languages = [
        {id: 'en', name: 'English'},
        {id: 'sp', name: 'Spanish'},
        {id: 'fr', name: 'French'},
        {id: 'ge', name: 'German'},
        {id: 'ch', name: 'Chinese'},
    ];
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    async function detectLanguage() {
        setIsLoading(true);
        const options = {
            method: 'POST',
            url: 'https://microsoft-translator-text.p.rapidapi.com/Detect',
            params: {
                'api-version': '3.0'
            },
            headers: {
                'x-rapidapi-key': 'c5025b1764msh21f42939066a3a9p1ef78ajsnceebf0b2af38',
                'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: [
                {
                    Text: title
                }
            ]
        };


        await axios.request(options).then((response) => {

            console.log(response.data[0].language);

        }).catch((error) => {
            console.log(error)
        });


    }

    useEffect(async () => {
        const valueId = await AsyncStorage.getItem('languageId');
        const valueName = await AsyncStorage.getItem('languageName');
        if (valueId !== null && valueName !== null) {
            setLanguageId(valueId);
            setLanguageName(valueName);
        } else {
            toggleModal()
        }
    }, []);

    // useEffect(() => {
    //     detectLanguage().then(r => setIsLoading(false))
    // }, []);

    async function handleSelectLanguage(languageId, languageName) {
        setLanguageId(languageId);
        setLanguageName(languageName);
        await AsyncStorage.setItem('languageId', languageId);
        await AsyncStorage.setItem('languageName', languageName);

        setIsModalVisible(false)
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.smallContainer}>

                <Pressable style={styles.pressable} onPressIn={() => setTitle("Pressed in")}
                           onPressOut={() => setTitle("Pressed out")}>

                    <Text>Hold to speak (STRANGER)</Text>

                </Pressable>


            </View>
            <View>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff"/>
                ) : (<></>)}
                <Text style={styles.title}>{title}</Text>

            </View>
            <View style={styles.smallContainer}>
                <Pressable style={styles.pressable} onPressIn={() => setTitle("Pressed in")}
                           onPressOut={() => setTitle("Pressed out")}>

                    <Text>Hold to speak</Text>

                </Pressable>
                <Text style={styles.title}>{languageName}</Text>


            </View>
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                style={styles.modal}
            >
                <View style={styles.modalContent}>
                    <FlatList
                        data={languages}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => (
                            <Pressable
                                onPress={() => handleSelectLanguage(item.id,item.name)}
                                style={styles.modalItem}
                            >
                                <Text style={styles.modalItemText}>{item.name}</Text>
                            </Pressable>
                        )}
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1, display: "flex", alignItems: 'center', justifyContent: 'center',
        padding: 24,
        backgroundColor: '#ffffff',
    },
    smallContainer: {
        display: "flex", alignItems: 'center', justifyContent: 'center', flex: 1,
    }, picker: {
        height: 50, width: '100%',
    },
    title: {


        color: '#20232a',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
    },
    pressable: {
        height: 150,
        width: 150,
        backgroundColor: 'rgba(65,141,255,0.52)',
        borderRadius: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }, modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        maxHeight: '50%',
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalItemText: {
        fontSize: 16,
    },
});