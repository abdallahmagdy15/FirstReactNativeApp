import { AsyncStorage } from 'react-native';
import axios from 'axios';
const tokenProvider = require('axios-token-interceptor');

const instance = axios.create({
    baseURL: 'http://10.0.2.2:51853'
});
instance.interceptors.request.use(tokenProvider({
    getToken: async () => await AsyncStorage.getItem('token')
}));

const getAllTopics = () => {
    return instance.get(`/api/topics`)
}

const getTopic = (id) => {
    return instance.get(`/api/topics/${id}`);
}


const updateTopic = (topic) => {

    return instance.put(`/api/topics/${topic.Top_Id}`, topic)
}

const addTopic = (topic) => {
    return instance.post(`/api/topics`, topic)
}

const deleteTopic = (id) => {
    return instance.delete(`/api/topics/${id}`)
}
export { getAllTopics, updateTopic, deleteTopic, getTopic, addTopic }