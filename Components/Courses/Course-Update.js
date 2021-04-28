import React from "react";
import { ActivityIndicator } from "react-native";
import { StyleSheet } from "react-native";
import { Button } from "react-native";
import { TextInput } from "react-native";
import { Picker } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { addCourse, getCourse, updateCourse } from '../../Controller/CourseDB'
import { getAllTopics } from '../../Controller/TopicDB'

export default class CourseUpdate extends React.Component {
    state = {
        course: {
            Crs_Id: 0,
            Crs_Name: '',
            Crs_Duration: '',
            Top_Id: 0
        },
        topics: []
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
            <View>
                <Text>Add or Update Course</Text>
                <View>
                    <Text>Id</Text>
                    <TextInput value={this.state.course.Crs_Id} onChangeText={this.handleIdChange} numeric keyboardType="numeric"
                        placeholder="Enter ID" />
                </View>
                <View>
                    <Text>Name</Text>
                    <TextInput value={this.state.course.Crs_Name} onChangeText={this.handleNameChange} placeholder="Enter Name" />
                </View>
                <View>
                    <Text>Duration</Text>
                    <TextInput value={this.state.course.Crs_Duration} onChangeText={this.handleDurationChange} keyboardType="numeric"
                        placeholder="Enter Duration" />
                </View>
                <View>
                    <Text>Pick Topic</Text>
                    <Picker
                        selectedValue={this.state.topics.length > 0 ? this.state.topics[0].Top_Id : null}
                        style={{ height: 20, width: 150 }}
                        onValueChange={this.handleTopicChange}>
                        {this.state.topics.map(t => (
                            <Picker.Item label={t.Top_Name} value={t.Top_Id} />
                        ))}
                    </Picker>
                </View>
                <View>
                    <Button
                        onPress={this.handleSubmit}
                        title="Submit"
                        color="#47ABD8"
                    />
                    <Button
                        onPress={this.handleReset}
                        title="Reset"
                        color="#40434E"
                    />
                </View>
            </View>
        )
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.course.Top_Id == 0) {
            alert("Please select a topic");
            return;
        }

        getCourse(this.state.course.Crs_Id).then(res => {
            //if student exits then update
            updateCourse(this.state.course).then(res => {
                this.props.navigation.navigate('CoursesList', res.data)
            })
        }).catch(res => {
            console.log(res);
            // if not then add as new student
            if (this.state.course.Topic != undefined)
                this.state.course.Topic = undefined;
            addCourse(this.state.course).then(res => {
                this.props.navigation.navigate('CoursesList', res.data)
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
