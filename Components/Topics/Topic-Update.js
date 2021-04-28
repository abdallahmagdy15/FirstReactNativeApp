import React from "react";
import { Button } from "react-native";
import { TextInput } from "react-native";
import { Text, View } from "react-native";
import { addTopic, getTopic, updateTopic } from '../../Controller/TopicDB'

export default class TopicUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: {
                Top_Id: 0,
                Top_Name: '',
                Course: []
            }
        }

    }

    componentDidMount() {
        const _topic = this.props.route.params;
        console.log("topic : ", _topic);
        if (_topic != undefined)
            this.setState({ topic: _topic })
    }

    render() {
        return (
            <View>
                <Text>Add or Update Course</Text>
                <View>
                    <Text>Id</Text>
                    <TextInput value={this.state.topic.Top_Id} onChangeText={this.handleIdChange} keyboardType="numeric"
                        placeholder="Enter ID" />
                </View>
                <View>
                    <Text>Name</Text>
                    <TextInput value={this.state.topic.Top_Name} onChangeText={this.handleNameChange} placeholder="Enter Name" />
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

        getTopic(this.state.topic.Top_Id).then(res => {
            //if student exits then update
            this.state.topic.Course = res.data.Course;
            updateTopic(this.state.topic).then(res => {
                this.props.navigation.navigate('TopicsList', res.data)
            })
        }).catch(res => {
            console.log(res);
            // if not then add as new student
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
                Top_Id: 0,
                Top_Name: '',
                Course: []
            }
        });
    }


    handleIdChange = (e) => {
        this.setState(prevState => {
            let topic = Object.assign({}, prevState.topic);
            topic.Top_Id = parseInt(e.target.value);
            return { topic };
        })
    }

    handleNameChange = (e) => {
        this.setState(prevState => {
            let topic = Object.assign({}, prevState.topic);
            topic.Top_Name = e.target.value;
            return { topic };
        })
    }
}
