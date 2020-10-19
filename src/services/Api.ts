import Axios from 'axios';

const session = Axios.create({
    baseURL: 'http://localhost:6789'
})

export default session;
