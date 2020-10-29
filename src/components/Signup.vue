s<template>
    <div class="modal-card">
        <header class="modal-card-head has-text-centered">
            <p class="modal-card-title">Sign Up</p>
            <button type="button" class="delete" @click="$parent.close()" />
        </header>
        <div class="modal-card-body">
            <b-steps
                v-model="activeFormStep"
                animated
                rounded
                mobile-mode="compact"
                :has-navigation="false"
            >
                <Step1 :user="user" @goNext="activeFormStep++" />
                <Step2 :user="user" @goNext="activeFormStep++" />
                <Step3
                    :user="user"
                    :isValidating="formValidating"
                    @cancel="
                        activeFormStep = 0;
                        $parent.close();
                    "
                    @confirm="doSignup"
                />
            </b-steps>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import UserServices from '@/services/UserServices';
import { AxiosError } from 'axios';
import Step1 from './signupSteps/Step1.vue';
import Step2 from './signupSteps/Step2.vue';
import Step3 from './signupSteps/Step3.vue';
import { DialogProgrammatic as Dialog } from 'buefy'


export type UserProp = {
    email: string;
    password: string;
    repeatPassword: string;
    firstName: string;
    lastName: string;
    birthdate: Date;
    birthdateValue: string;
    phoneNumber: string;
}

export default defineComponent({
    components: {
        Step1,
        Step2,
        Step3
    },
    setup(props, { emit }) {
        // steps variables
        const activeFormStep = ref(0);
        const formValidating = ref(false);

        const user = ref({
            email: '',
            password: '',
            repeatPassword: '',
            firstName: '',
            lastName: '',
            birthdate: undefined,
            birthdateValue: '',
            phoneNumber: ''
        });

        function resetUserFields() {
            user.value.email = '';
            user.value.password = '',
                user.value.repeatPassword = '',
                user.value.firstName = '',
                user.value.lastName = '',
                user.value.birthdate = undefined,
                user.value.birthdateValue = '',
                user.value.phoneNumber = ''
        }

        async function doSignup() {
            formValidating.value = true;

            await UserServices.signup({
                email: user.value.email,
                password: user.value.password,
                firstName: user.value.firstName,
                lastName: user.value.lastName,
                birthdate: user.value.birthdate,
                phoneNumber: user.value.phoneNumber
            })
            .then(() => {
                resetUserFields();
                emit('successfulSignup');
                formValidating.value = false;
            })
            .catch((error: AxiosError) => {
                Dialog.alert({
                    type: 'is-danger',
                    title: 'Error',
                    message: error.response?.data.message,
                    canCancel: false
                });
                user.value.password = user.value.repeatPassword = '';
                activeFormStep.value = 0;
            })
        }

        return {
            user,
            // step form varibales
            activeFormStep,
            formValidating,
            // methods
            doSignup
        }
    }
});

</script>
