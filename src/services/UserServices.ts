import Api from './Api'


export default {
    // TODO: remove me
    echo() {
        console.log(Api)
        const data = {
            hey: 'how are you?'
        }

        return Api.post('/echo', data, { withCredentials: true });
    },

    login(body: { email: string, password: string }) {
        return Api.post('/users/login', body, { withCredentials: true });
    },

    checkEmail(email: String) {
        return Api.post(`/users/checkEmail/${email}`);
    }
}
