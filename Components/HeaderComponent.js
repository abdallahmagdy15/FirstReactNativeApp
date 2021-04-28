import React from "react";
import { View } from "react-native";
import { Text } from "react-native";
import { Header,Button } from "react-native/Libraries/NewAppScreen";
//import { withRouter } from "react-router-native";

export default class HeaderComponent extends React.Component {
    state = {

    }
    render() {
        return (
            <>
                <Header
                    leftComponent={<Text>🌙 Ramadan Kareem  |</Text>}
                    centerComponent={{ text: '', style: { color: '#fff' } }}
                    rightComponent={
                        <View>
                            <Text hidden={localStorage.getItem("username") == null}>
                                Welcome {localStorage.getItem("username")} | </Text>
                            <Button onPress={this.logout.bind(this)} title="Logout" />
                        </View>
                    }
                />
            </>
        );
    }

    logout() {
        localStorage.clear();
        this.props.navigation.navigate.push('/login')
    }
}

//export default withRouter(HeaderComponent);
