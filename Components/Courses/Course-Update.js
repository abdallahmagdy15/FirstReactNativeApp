import React from "react";
import { Alert, Keyboard, KeyboardAvoidingView } from "react-native";
import styles from "../formStyle";
import { Button } from 'react-native';
import { TextInput } from "react-native";
import { Picker } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { addCourse, getCourse, updateCourse } from '../../Controller/CourseDB'
import { getAllTopics } from '../../Controller/TopicDB'

export default class CourseUpdate extends React.Component {
    state = {
        course: {
            Crs_Id: 0,
            Crs_Name: '',
            Crs_Duration: 0,
            Top_Id: 0
        },
        topics: [{
            Top_Id: 1,
            Top_Name: 'Web'
        }]
    }
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("crs update : ", this.props.route.params);
        const _course = this.props.route.params;
        if (_course != undefined)
            this.setState({ course: _course })

        getAllTopics().then(res => {
            this.setState({ topics: res.data })
        }).catch(err => {
            console.log(err.response);
        })
    }

    componentDidUpdate() {
        console.log("crs update : ", this.props.route.params);
        const _course = this.props.route.params;
        if (_course != undefined) {
            if (this.state.course != _course)
                this.setState({ course: _course })
        }
    }

    render() {

        return (
            <KeyboardAvoidingView style={styles.containerView} behavior="padding">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.loginScreenContainer}>
                        <View style={styles.loginFormView}>
                            <Text style={styles.logoText}>Add or Update Course</Text>
                            <TextInput value={this.state.course.Crs_Id} onChangeText={this.handleIdChange}
                                numeric keyboardType="numeric"
                                placeholder="Enter ID" style={styles.formTextInput} />
                            <TextInput value={this.state.course.Crs_Name} onChangeText={this.handleNameChange} placeholder="Enter Name"
                                style={styles.formTextInput} />

                            <TextInput value={this.state.course.Crs_Duration} onChangeText={this.handleDurationChange} keyboardType="numeric"
                                placeholder="Enter Duration" style={styles.formTextInput} />
                            <Text style={{ marginLeft: 16, marginTop: 5, color: "#264653" }}>Pick a topic</Text>
                            <Picker
                                style={{
                                    marginLeft: 15,
                                    marginRight: 15,
                                    marginTop: 5,
                                    marginBottom: 5
                                }}
                                selectedValue={this.state.topics.length > 0 ? this.state.topics[0].Top_Id : null}
                                //style={{ height: 20, width: 150 }}
                                onValueChange={this.handleTopicChange}>
                                {this.state.topics.map(t => (
                                    <Picker.Item label={t.Top_Name} value={t.Top_Id} />
                                ))}
                            </Picker>

                            <View style={styles.formTextInput, {
                                flexDirection: "row",
                                justifyContent: "space-around"
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
        const { Crs_Id, Crs_Name, Crs_Duration, Top_Id } = this.state.course;
        if (Crs_Id == 0 || Crs_Name == '' || Crs_Duration == 0 || Top_Id == 0) {
            Alert.alert('Please fill all the fields!');
            return;
        }

        getCourse(this.state.course.Crs_Id).then(res => {
            //if student exits then update
            updateCourse(this.state.course).then(res => {
                console.log("crs updated");
                this.props.navigation.navigate('CoursesList', res.data)
            }).catch(err => {
                console.log(err.response);
            })
        }).catch(res => {
            console.log(res);
            // if not then add as new student
            if (this.state.course.Topic != undefined)
                this.state.course.Topic = undefined;
            addCourse(this.state.course).then(res => {
                console.log("crs added");
                this.props.navigation.navigate('CoursesList', res.data)
            }).catch(err => {
                console.log(err.response);
            })
        })
    }

    handleReset = () => {
        this.setState({
            course: {
                Crs_Id: 0,
                Crs_Name: '',
                Crs_Duration: '',
                Top_Id: 0
            }
        })
    }


    handleIdChange = (val) => {
        this.setState(prevState => {
            let course = Object.assign({}, prevState.course);
            course.Crs_Id = parseInt(val);
            return { course };
        })
    }

    handleNameChange = (val) => {
        this.setState(prevState => {
            let course = Object.assign({}, prevState.course);
            course.Crs_Name = val;
            return { course };
        })
    }

    handleDurationChange = (val) => {
        this.setState(prevState => {
            let course = Object.assign({}, prevState.course);
            course.Crs_Duration = parseInt(val);
            return { course };
        })
    }

    handleTopicChange = (val) => {
        this.setState(prevState => {
            let course = Object.assign({}, prevState.course);
            course.Top_Id = parseInt(val);
            return { course };
        })
    }
}
