import React from "react";
import { getAllTopics, deleteTopic } from '../../Controller/TopicDB'
import { Picker, StyleSheet, View } from "react-native";
import { ActivityIndicator, DataTable } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native";

export default class TopicsList extends React.Component {
    state = {
        topics: [
            {
                Top_Id: 1,
                Top_Name: 'Web',
                Course: [{
                    Crs_Id: 1,
                    Crs_Name: 'React',
                    Crs_Duration: 50
                },
                {
                    Crs_Id: 2,
                    Crs_Name: 'Angular',
                    Crs_Duration: 60
                }]
            },
            {
                Top_Id: 2,
                Top_Name: 'Programming',
                Course: [{
                    Crs_Id: 1,
                    Crs_Name: 'C#',
                    Crs_Duration: 50
                },
                {
                    Crs_Id: 2,
                    Crs_Name: 'JavaScript',
                    Crs_Duration: 60
                }]
            }
        ]
    }
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const _topics = this.props.route.params;
        if (_topics != undefined)
            this.setState({ topics: _topics })
        else {
            getAllTopics().then(res => {
                this.setState({ topics: res.data })
            })
        }
    }

    componentDidUpdate() {
        getAllTopics().then(res => {
            if (this.state.topics != res.data)
                this.setState({ topics: res.data })
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

        if (this.state.topics.length == 0)
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
                        <DataTable.Title>Courses</DataTable.Title>
                        <DataTable.Title></DataTable.Title>
                    </DataTable.Header>
                    {this.state.topics.map((row) => {
                        return (
                            <DataTable.Row key={row.Top_Id}>
                                <DataTable.Cell >{row.Top_Id}</DataTable.Cell>
                                <DataTable.Cell style={{flex: 3}}>{row.Top_Name}</DataTable.Cell>
                                <DataTable.Cell style={{flex: 4}}>
                                    <Picker
                                        selectedValue={row.Course.length > 0 ? row.Course[0].Crs_Id : null}
                                        style={{ height: 20, width: 100 }}>
                                        {row.Course.map(t => (
                                            <Picker.Item label={t.Crs_Name} />
                                        ))}
                                    </Picker>
                                </DataTable.Cell>
                                <DataTable.Cell style={{flex: 3}}>
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
                        deleteTopic(id).then(res => {
                            this.setState({ topics: res.data });
                        })
                    }
                }
            ]
        );
    }

    select = (st) => {
        this.props.navigation.navigate('TopicUpdate', st);
    }
}
