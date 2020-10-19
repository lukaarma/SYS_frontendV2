import Api from './Api'
import { ref } from '@vue/composition-api';

export default {

    echo() {
        console.log(Api)
        const data = {
            hey: 'how are you?'
        }

        return Api.post('/echo', data, { withCredentials: true });
    },

    login(body: { email: string, password: string }) {
        return Api.post('/users/login', body, { withCredentials: true});
    }
}
