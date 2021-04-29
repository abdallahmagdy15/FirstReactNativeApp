import axios from "axios";
import React, { Component } from "react";
import styles from "./formStyle";
import { Keyboard, Text, View, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';
import { AsyncStorage } from 'react-native';
import { ActivityIndicator } from "react-native-paper";

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.checkUsername();
    }

    checkUsername = async () => {
        var uname = await AsyncStorage.getItem("username");
        if (uname != null) {
            console.log(uname);
            this.props.navigation.navigate('CoursesList');
        }
    }
    state = {
        username: '',
        password: '',
        isLoading: false
    }
    render() {

        return (
            <KeyboardAvoidingView style={styles.containerView} behavior="padding">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.formScreenContainer}>
                        <View style={styles.formView}>
                            <Text style={styles.logoText}>Sign In</Text>
                            <TextInput
                                placeholderColor="#c4c3cb" style={styles.formTextInput}
                                onChangeText={this.unameHandler} placeholder="Enter Username" />

                            <TextInput placeholder="Enter password"
                                placeholderColor="#c4c3cb" style={styles.formTextInput}
                                onChangeText={this.passHandler} secureTextEntry={true} />
                            <Button
                                buttonStyle={styles.submitButton,
                                    { backgroundColor: "#2a9d8f", margin: 15 }}
                                onPress={this.submitForm}
                                title={'Login'}
                            />
                            <ActivityIndicator animating={this.state.isLoading} color="#00ff00" />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView >
        );
    }
    unameHandler = (text) => {
        this.state.username = text;
    }
    passHandler = (text) => {
        this.state.password = text;
    }
    submitForm = () => {
        if (this.state.username == '' || this.state.password == '') {
            Alert.alert("Username and Password are required.");
            return;
        }
        this.setState({
            isLoading: true
        })
        axios.post('http://10.0.2.2:51853/api/Auth',
            { username: this.state.username, password: this.state.password })
            .then(this.onSuccess.bind(this)).catch(this.onFailure.bind(this))
    }
    onSuccess = function (res) {
        this.setState({
            isLoading: false
        })
        Alert.alert("Signed In", "Welcome " + this.state.username);
        AsyncStorage.setItem("username", this.state.username);
        AsyncStorage.setItem("token", res.data.Authorization);
        this.props.setAuthentication(true);
        this.props.navigation.navigate('CoursesList');
    }
    
    onFailure = function (err) {
        console.log("Error Signing In", err.response);
        this.setState({
            isLoading: false
        })
        if (err.response.status == 401) {
            Alert.alert('Wrong username or password!');
        }
        else
            Alert.alert('An error has occurred!');
    }
}
