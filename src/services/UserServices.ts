
import Api from './Api'


type LoginBody = {
    email: string,
    password: string
};

type SignupBody = LoginBody & {
      firstName: string,
      lastName: string,
      birthdate: Date | undefined,
      phoneNumber: string
};

export default {
    // TODO: remove me
    echo() {
        console.log(Api)
        const data = {
            hey: 'how are you?'
        }

        return Api.post('/echo', data, { withCredentials: true });
    },

    login(body: LoginBody) {
        return Api.post('/users/login', body, { withCredentials: true });
    },

    signup(body: SignupBody) {
        return Api.post('/users/signup', body);
    },

    checkEmail(email: string) {
        return Api.post(`/users/checkEmail/${email}`);
    }
}
