<template>
    <div>
        <b-step-item step="1" label="Account Info">
            <!-- EMAIL -->
            <b-field label="Email" :type="{ 'is-danger': emailError }">
                <template v-slot:message>
                    {{ emailErrorMessage }}
                </template>
                <b-input
                    v-model="user.email"
                    :disabled="disableAll"
                    @input="
                        clearError('email');
                        emailDone = false;
                    "
                    @blur="validateEmail()"
                    type="email"
                    placeholder="email@domain.com"
                />
            </b-field>
            <!-- PASSWORD -->
            <b-field label="Password" :type="{ 'is-danger': passwordError }">
                <template v-slot:message>
                    {{
                        passwordErrorMessage
                            ? passwordErrorMessage
                            : passwordHelpMessage
                    }}
                </template>
                <b-input
                    v-model="user.password"
                    :disabled="disableAll"
                    @input="
                        clearError('password');
                        passwordDone = false;
                        validatePassword();
                    "
                    type="password"
                    placeholder="password"
                    password-reveal
                ></b-input>
            </b-field>

            <!-- REPEAT PASSWORD -->
            <b-field
                label="Repeat Password"
                :type="{
                    'is-danger': repeatPasswordError && !repeatPasswordDisabled,
                }"
            >
                <template v-slot:message>
                    {{
                        repeatPasswordDisabled ? "" : repeatPasswordErrorMessage
                    }}
                </template>
                <b-input
                    v-model="user.repeatPassword"
                    :disabled="repeatPasswordDisabled || disableAll"
                    @input="
                        clearError('repeatPassword');
                        passwordDone = false;
                        validateRepeatPassword();
                    "
                    type="password"
                    placeholder="password"
                    password-reveal
                ></b-input>
            </b-field>

            <!-- NEXT -->
            <div class="buttons is-right">
                <b-button
                    :disabled="!(emailDone && passwordDone)"
                    :type="{ 'is-loading': stepValidating }"
                    @click="goNextStep"
                    class="is-primary"
                >
                    Next
                </b-button>
            </div>
        </b-step-item>
    </div>
</template>


<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import userServices from '@/services/UserServices';
import { AxiosError } from 'axios';


export default defineComponent({
    setup(props, { emit }) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9][a-zA-Z0-9-]{1,252}(?:\.[a-zA-Z0-9]{2,})+$/
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])([a-zA-Z\d$@!%*?&]{8,}$)$/

        // email
        const emailError = ref(false);
        const emailErrorMessage = ref('');
        const emailDone = ref(false);
        // password
        const passwordError = ref(false);
        const passwordErrorMessage = ref('');
        const passwordHelp = ['minimum lenght 8', '1 uppercase letter', '1 lowercase letter', '1 number', '1 special character @$!%*?&'];
        const passwordHelpMessage = ref('Required: ' + passwordHelp.join(', '));
        // repeat password
        const repeatPasswordDisabled = ref(true);
        const repeatPasswordError = ref(false);
        const repeatPasswordErrorMessage = ref('');
        const passwordDone = ref(false);

        const disableAll = ref(false);
        const stepValidating = ref(false);
        const user = ref({
            email: '',
            password: '',
            repeatPassword: ''
        });

        function clearError(field: 'email' | 'password' | 'repeatPassword'): void {
            if (field === 'email') {
                emailError.value = false;
                emailErrorMessage.value = '';
            }
            else if (field === 'password') {
                passwordError.value = false;
                passwordErrorMessage.value = '';
                passwordHelpMessage.value = '';
            }
            else if (field === 'repeatPassword') {
                repeatPasswordError.value = false;
                repeatPasswordErrorMessage.value = '';
            }
            else {
                console.log(`Error clear not implemented for '${field}'!`);
            }
        }

        async function validateEmail(): Promise<boolean> {
            if (emailRegex.test(user.value.email)) {
                return await userServices.checkEmail(user.value.email)
                    .then(() => {
                        emailError.value = false;
                        emailDone.value = true;

                        return true;
                    })
                    .catch((error: AxiosError) => {
                        console.log(error.response?.data.error)
                        emailErrorMessage.value = error.response?.data.message ?? '';

                        return false;
                    });

            }
            // do not move the error booleasn outside of each t screws with the sty
            else if (user.value.email.length) {
                emailErrorMessage.value = 'This is not a valid email!';
                emailError.value = true
            }
            else {
                emailErrorMessage.value = 'This field is required!';
                emailError.value = true
            }

            return false;
        }

        function validateRepeatPassword(firts?: boolean): boolean {
            if (user.value.repeatPassword === user.value.password) {
                // future trigger for step validation
                passwordDone.value = true;

                return true;
            }
            // do not move the error booleasn outside of each t screws with the style
            else if (user.value.repeatPassword.length) {
                repeatPasswordErrorMessage.value = "Passwords don't match";
                repeatPasswordError.value = true;
            }
            else if (!firts) {
                repeatPasswordErrorMessage.value = 'Field is required!';
                repeatPasswordError.value = true;
            }

            return false;
        }

        function validatePassword(): boolean {
            if (passwordRegex.test(user.value.password)) {
                clearError('password');
                repeatPasswordDisabled.value = false;

                return validateRepeatPassword(true);
            }
            else if (user.value.password.length) {
                const illegalChars = user.value.password.match(/[^a-zA-Z\d$@!%*?&]+/);

                if (illegalChars) {
                    passwordErrorMessage.value = 'Illegal character inserted. Plesae use only lowecase and uppercase letter, numbers and $@!%*?&';
                }
                else {
                    const message = [];
                    if (user.value.password.length < 8) {
                        message.push(passwordHelp[0]);
                    }
                    if (user.value.password.search(/[A-Z]/) === -1) {
                        message.push(passwordHelp[1]);
                    }
                    if (user.value.password.search(/[a-z]/) === -1) {
                        message.push(passwordHelp[2]);
                    }
                    if (user.value.password.search(/\d/) === -1) {
                        message.push(passwordHelp[3]);
                    }
                    if (user.value.password.search(/[@$!%*?&]/) === -1) {
                        message.push(passwordHelp[4]);
                    }

                    passwordHelpMessage.value = 'Required: ' + message.join(', ');
                }
            }
            else {
                passwordErrorMessage.value = 'This field is required!';
            }

            passwordError.value = true;
            repeatPasswordDisabled.value = true;

            return false;
        }

        async function goNextStep(): Promise<void> {
            stepValidating.value = disableAll.value = true;

            const emailOk = await validateEmail();
            const passwordOk = validatePassword();

            if (emailOk && passwordOk) {
                emit('goNext', user.value.email, user.value.password);
            }

            stepValidating.value = disableAll.value = false;
        }


        return {
            // user info
            user,
            // email validation
            emailError,
            emailErrorMessage,
            validateEmail,
            emailDone,
            // password validation
            passwordError,
            passwordErrorMessage,
            passwordHelpMessage,
            validatePassword,
            // check repeat password
            repeatPasswordDisabled,
            repeatPasswordError,
            repeatPasswordErrorMessage,
            validateRepeatPassword,
            passwordDone,
            // general
            stepValidating,
            disableAll,
            goNextStep,
            clearError
        }
    }
});

</script>
