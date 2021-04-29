import React from "react";
import { Alert, Keyboard, KeyboardAvoidingView } from "react-native";
import styles from "../formStyle";
import { Button } from 'react-native';
import { TextInput } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { addTopic, getTopic, updateTopic } from '../../Controller/TopicDB'
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default class TopicUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: {
                Top_Id: '',
                Top_Name: '',
                Course: []
            }
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
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.containerView} behavior="padding">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.loginScreenContainer}>
                        <View style={styles.loginFormView}>
                            <Text style={styles.logoText}>Add or Update Topic</Text>
                            <TextInput value={String(this.state.topic.Top_Id)} onChangeText={this.handleIdChange}
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
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView >
        )
    }

    handleSubmit = () => {
        const { Top_Id, Top_Name } = this.state.topic;
        if (Top_Id == 0 || Top_Name == '') {
            Alert.alert('Please fill all the fields!');
            return;
        }
        getTopic(this.state.topic.Top_Id).then(res => {
            //if topic exits then update
            this.state.topic.Course = res.data.Course;
            updateTopic(this.state.topic).then(res => {
                this.props.navigation.navigate('TopicsList', res.data)
            })
        }).catch(res => {
            console.log(res);
            // if not then add as new topic
            if (this.state.topic.Course != undefined)
                this.state.topic.Course = undefined;
            addTopic(this.state.topic).then(res => {
                this.props.navigation.navigate('TopicsList', res.data)
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
            topic.Top_Id = parseInt(val);
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
