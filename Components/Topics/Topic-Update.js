import React from "react";
import { Alert, Keyboard, KeyboardAvoidingView } from "react-native";
import styles from "../formStyle";
import { Button } from 'react-native';
import { TextInput } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { addTopic, getTopic, updateTopic } from '../../Controller/TopicDB'
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class TopicUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: {
                Top_Id: '',
                Top_Name: '',
                Course: []
            },
            isLoading: false,
            isAuthenticated: false
        }
    }

    componentDidMount() {
        const _topic = this.props.route.params;
        if (_topic != undefined) {
            this.setState({ topic: _topic })
        }
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            const _topic = this.props.route.params;
            if (_topic != undefined) {
                _topic.Top_Id = String(_topic.Top_Id)
                if (_topic != this.state.topic) {
                    this.setState({ topic: _topic })
                }
            }

            AsyncStorage.getItem("username").then((uname) => {
                console.log(uname);
                if (uname == null)
                    this.setState({
                        isAuthenticated: false
                    })
                else
                    this.setState({
                        isAuthenticated: true
                    })
            });
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
        if (!this.state.isAuthenticated) {
            return (
                <View styles={{ flex: 1, justifyContent: "center", height: "100%" }}>
                    <Text style={{ fontSize: 20, marginTop: 100, marginBottom: 15, color: "#e9c46a", textAlign: "center" }}>You must login first!</Text>
                    <Button color="#2a9d8f" style={{ marginLeft: 15, marginRight: 15 }} onPress={() => { this.props.navigation.navigate('Login') }} title="Login" />
                </View>)
        }

        return (
            <KeyboardAvoidingView style={styles.containerView} behavior="padding">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.loginScreenContainer}>
                        <View style={styles.loginFormView}>
                            <Text style={styles.logoText}>Add or Update Topic</Text>
                            <TextInput value={this.state.topic.Top_Id} onChangeText={this.handleIdChange}
                                keyboardType="numeric" style={styles.formTextInput}
                                placeholder="Enter ID" />
                            <TextInput value={this.state.topic.Top_Name} onChangeText={this.handleNameChange}
                                placeholder="Enter Name" style={styles.formTextInput} />
                            <View style={styles.formTextInput, {
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                marginTop: 15
                            }}>
                                <Button
                                    onPress={this.handleSubmit}
                                    title="Submit"
                                    color="#2a9d8f"
                                />
                                <Button
                                    onPress={this.handleReset}
                                    title="Reset"
                                    color="#e9c46a"
                                />
                            </View>
                            <ActivityIndicator animating={this.state.isLoading} color="#00ff00" />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView >
        )
    }

    handleSubmit = () => {
        const { Top_Id, Top_Name } = this.state.topic;
        if (Top_Id == '' || Top_Name == '') {
            Alert.alert('Please fill all the fields!');
            return;
        }
        this.setState({
            isLoading: true
        })
        getTopic(this.state.topic.Top_Id).then(res => {
            //if topic exits then update
            this.state.topic.Course = res.data.Course;
            updateTopic(this.state.topic).then(res => {
                this.setState({
                    isLoading: false
                })
                this.props.navigation.navigate('TopicsList', res.data)
            }).catch(err => {
                this.setState({
                    isLoading: false
                })
                console.log(err.response);
            })
        }).catch(res => {
            console.log(res);
            // if not then add as new topic
            if (this.state.topic.Course != undefined)
                this.state.topic.Course = undefined;
            addTopic(this.state.topic).then(res => {
                this.setState({
                    isLoading: false
                })
                console.log(res.data);
                this.props.navigation.navigate('TopicsList', res.data);
            }).catch(err => {
                this.setState({
                    isLoading: false
                })
                console.log(err.response);
            })
        })
    }

    handleReset = () => {
        this.setState({
            topic: {
                Top_Id: '',
                Top_Name: '',
                Course: []
            }
        });
    }


    handleIdChange = (val) => {
        this.setState(prevState => {
            let topic = Object.assign({}, prevState.topic);
            topic.Top_Id = val;
            return { topic };
        })
    }

    handleNameChange = (val) => {
        this.setState(prevState => {
            let topic = Object.assign({}, prevState.topic);
            topic.Top_Name = val;
            return { topic };
        })
    }
}
