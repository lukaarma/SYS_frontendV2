TODO: remove button disabled
<template>
    <div>
        <b-step-item step="1" label="Account Info" :clickable="false">
            <!-- EMAIL -->
            <b-field label="Email" :type="{ 'is-danger': emailError }">
                <template v-slot:message>
                    {{ emailErrorMessage }}
                </template>
                <b-input
                    v-model="user.email"
                    :disabled="disableAll"
                    @input="clearError('email')"
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
                        validatePassword();
                    "
                    type="password"
                    oncopy="return false"
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
                        validateRepeatPassword();
                    "
                    type="password"
                    oncopy="return false"
                    placeholder="password"
                    password-reveal
                ></b-input>
            </b-field>

            <!-- NEXT -->
            <div class="buttons is-right">
                <b-button
                    :type="{ 'is-loading': stepValidating }"
                    @click="goNextStep"
                    class="is-primary mt-4"
                >
                    Next
                </b-button>
            </div>
        </b-step-item>
    </div>
</template>


<script lang="ts">
import { defineComponent, PropType, ref } from '@vue/composition-api';
import userServices from '@/services/UserServices';
import { AxiosError } from 'axios';
import { UserProp } from '../Signup.vue';


export default defineComponent({
    props: {
        user: {
            type: Object as PropType<UserProp>,
            required: true
        }
    },
    setup(props, { emit }) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9][a-zA-Z0-9-]{1,252}(?:\.[a-zA-Z0-9]{2,})+$/
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])([a-zA-Z\d$@!%*?&]{8,}$)$/
        // email
        const emailError = ref(false);
        const emailErrorMessage = ref('');
        // password
        const passwordError = ref(false);
        const passwordErrorMessage = ref('');
        const passwordHelp = ['minimum lenght 8', '1 uppercase letter', '1 lowercase letter', '1 number', '1 special character @$!%*?&'];
        const passwordHelpMessage = ref('Required: ' + passwordHelp.join(', '));
        // repeat password
        const repeatPasswordDisabled = ref(true);
        const repeatPasswordError = ref(false);
        const repeatPasswordErrorMessage = ref('');
        const disableAll = ref(false);
        const stepValidating = ref(false);

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
            if (emailRegex.test(props.user.email)) {
                return await userServices.checkEmail(props.user.email)
                    .then(() => {
                        return true;
                    })
                    .catch((error: AxiosError) => {
                        console.error(`[SIGNUP STEP 1] signup failed! Err code: 'error.response?.data.error'`);
                        emailError.value = true;
                        emailErrorMessage.value = error.response?.data.message ?? '';

                        return false;
                    });
            }
            // do not move the error booleasn outside of each t screws with the sty
            else if (props.user.email.length) {
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
            if (props.user.repeatPassword === props.user.password) {
                // future trigger for step validation

                return true;
            }
            // do not move the error booleasn outside of each t screws with the style
            else if (props.user.repeatPassword.length) {
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
            if (passwordRegex.test(props.user.password)) {
                clearError('password');
                repeatPasswordDisabled.value = false;

                return validateRepeatPassword(true);
            }
            else if (props.user.password.length) {
                const illegalChars = props.user.password.match(/[^a-zA-Z\d$@!%*?&]+/);

                if (illegalChars) {
                    passwordErrorMessage.value = 'Illegal character inserted. Plesae use only lowecase and uppercase letter, numbers and $@!%*?&';
                }
                else {
                    const message = [];
                    if (props.user.password.length < 8) {
                        message.push(passwordHelp[0]);
                    }
                    if (props.user.password.search(/[A-Z]/) === -1) {
                        message.push(passwordHelp[1]);
                    }
                    if (props.user.password.search(/[a-z]/) === -1) {
                        message.push(passwordHelp[2]);
                    }
                    if (props.user.password.search(/\d/) === -1) {
                        message.push(passwordHelp[3]);
                    }
                    if (props.user.password.search(/[@$!%*?&]/) === -1) {
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
                emit('goNext', props.user.email, props.user.password);
            }

            stepValidating.value = disableAll.value = false;
        }


        return {
            // email validation
            emailError,
            emailErrorMessage,
            validateEmail,
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
            // general
            stepValidating,
            disableAll,
            goNextStep,
            clearError
        }
    }
});

</script>
