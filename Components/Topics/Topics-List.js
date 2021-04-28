import React from "react";
import { getAllTopics, deleteTopic } from '../../Controller/TopicDB'
import { View } from "react-native";
import { Text } from "react-native";

export default class TopicsList extends React.Component {
    state = {
        topics: []
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
            this.setState({ topics: res.data })
        })
    }
    render() {

        if (this.state.topics.length == 0)
            return (
                <Text> Topics List </Text>
            )

        return (
            <View></View>

            // <TableContainer className="p-5" component={Paper}>
            //     <Table style={{ minWidth: "650" }} aria-label="simple table">
            //         <TableHead>
            //             <TableRow style={{backgroundColor:"#d8e3e7"}}>
            //                 <TableCell>Id</TableCell>
            //                 <TableCell align="right">Name</TableCell>
            //                 <TableCell align="right">Courses</TableCell>
            //                 <TableCell align="right">
            //                 </TableCell>
            //             </TableRow>
            //         </TableHead>
            //         <TableBody>
            //             {this.state.topics.map((row) => (
            //                 <TableRow key={row.Crs_Id}>
            //                     <TableCell component="th" scope="row">
            //                         {row.Top_Id}
            //                     </TableCell>
            //                     <TableCell align="right">{row.Top_Name}</TableCell>
            //                     <TableCell align="right">
            //                         <select className="form-control">
            //                             {row.Course.map(el => (
            //                                 <option>{el.Crs_Name}</option>
            //                             ))}
            //                         </select>
            //                     </TableCell>
            //                     <TableCell align="right">
            //                         <a className="btn btn-info mr-1" onClick={this.select.bind(this, row)}>Edit</a>
            //                         <a className="btn btn-danger" onClick={this.delete.bind(this, row.Top_Id)}>Delete</a>
            //                     </TableCell>
            //                 </TableRow>
            //             ))}
            //         </TableBody>
            //     </Table>
            // </TableContainer>
        );
    }


    delete = (id) => {
        var x = window.confirm("Are you sure?");
        if (x) {
            deleteTopic(id).then(res => {
                this.setState({ topics: res.data });
            })
        }
    }

    select = (st) => {
        this.props.navigation.navigate('TopicUpdate', st);
    }


}
//export default withRouter(TopicsList)