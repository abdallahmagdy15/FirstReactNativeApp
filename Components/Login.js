import axios from "axios";
import React, { Component } from "react";
import { Alert } from "react-native";
import { Text, Button } from "react-native";
import { TextInput } from "react-native";
import { View } from "react-native";
// import { withRouter } from "react-router-native";
import { AsyncStorage } from 'react-native';
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
        password: ''
    }
    render() {
        return (
            <View>
                <Text>Sign In</Text>
                <View>
                    <Text>Username</Text>
                    <TextInput onChangeText={this.unameHandler} placeholder="Enter Username" />
                </View>

                <View>
                    <Text>Password</Text>
                    <TextInput placeholder="Enter password"
                        onChangeText={this.passHandler} />
                </View>
                <Button
                    onPress={this.submitForm}
                    title="Login"
                    color="#841584"
                />
            </View>
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

        axios.post('http://10.0.2.2:51853/api/Auth',
            { username: this.state.username, password: this.state.password }).then(res => {
                console.log("signing in...");
                AsyncStorage.setItem("username", this.state.username);
                AsyncStorage.setItem("token", res.data.Authorization);
                this.props.navigation.navigate('CoursesList')
            }).catch(function (err) {
                console.log("Error Signing In", err.response);
                if (err.response.status == 401) {
                    Alert.alert('Wrong username or password!');
                }
                else
                    Alert.alert('An error has occurred!');
            });
    }
}
// export default withRouter(Login);
