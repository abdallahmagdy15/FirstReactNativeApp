import React from "react";
import { getAllCourses, deleteCrs } from '../../Controller/CourseDB'
import { View } from "react-native";
import { DataTable } from 'react-native-paper';
import { Button } from "react-native";
import { ScrollView } from "react-native";
import { Alert } from "react-native";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native";

export default class CoursesList extends React.Component {
    state = {
        courses: [
            //   {
            //     Crs_Id: 1,
            //     Crs_Name: 'React',
            //     Crs_Duration: 50,
            //     Topic: { Top_Id: 1, Top_Name: 'Web' }
            // },
            // {
            //     Crs_Id: 2,
            //     Crs_Name: 'Angular',
            //     Crs_Duration: 60,
            //     Topic: { Top_Id: 1, Top_Name: 'Web' }
            // }
        ]
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const _courses = this.props.route.params;
        if (_courses != undefined)
            this.setState({ courses: _courses })
        else {
            console.log("start loading courses")
            getAllCourses().then((res) => {
                this.setState({ courses: res.data })
            }).catch(err => {
                console.log(err.response);
            })
        }
    }

    componentDidUpdate() {
        getAllCourses().then((res) => {
            if (this.state.courses != res.data)
                this.setState({ courses: res.data })
        })
    }

    render() {
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: "center"
            },
            horizontal: {
                flexDirection: "row",
                justifyContent: "space-around",
                padding: 10
            }
        });

        if (this.state.courses.length == 0)
            return (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#00ff00" />
                </View>
            )

        return (
            <ScrollView>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Id</DataTable.Title>
                        <DataTable.Title>Name</DataTable.Title>
                        <DataTable.Title >Duration</DataTable.Title>
                        <DataTable.Title>Topic</DataTable.Title>
                        <DataTable.Title></DataTable.Title>
                    </DataTable.Header>
                    {this.state.courses.map((row) => {
                        return (
                            <DataTable.Row key={row.Crs_Id}>
                                <DataTable.Cell  style={{flex: 1}}>{row.Crs_Id}</DataTable.Cell>
                                <DataTable.Cell style={{flex: 2}}>{row.Crs_Name}</DataTable.Cell>
                                <DataTable.Cell  style={{flex: 1}}>{row.Crs_Duration}</DataTable.Cell>
                                <DataTable.Cell style={{flex: 2}}>{row.Topic.Top_Name}</DataTable.Cell>
                                <DataTable.Cell style={{flex:2}}>
                                    <Button color="#2a9d8f" onPress={this.select.bind(this, row)} title="Edit" />
                                    <Button color="#e76f51" onPress={this.delete.bind(this, row.Crs_Id)} title="Del" />
                                </DataTable.Cell>
                            </DataTable.Row>
                        )
                    })}
                </DataTable>
            </ScrollView>

        );
    }


    delete = (id) => {
        Alert.alert(
            "Confirm Deletion",
            "Are you Sure?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        deleteCrs(id).then(res => {
                            this.setState({ courses: res.data });
                        })
                    }
                }
            ]
        );
    }

    select = (st) => {
        this.props.navigation.navigate('CourseUpdate', st);
    }

}

