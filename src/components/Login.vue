TODO: login error in modal header
TODO: actual login logic
<template>
    <div class="modal-card">
        <div class="modal-card-body">
            <!-- EMAIL -->
            <b-field
                label="Email"
                :type="{ 'is-danger': !emailValid || !loginValid }"
            >
                <!-- This is needed to override the field default message inherited
                from the html input, so that we have complete controll over when and how
                error messages are displayed-->
                <template v-slot:message>
                    {{ emailError }}
                </template>
                <b-input
                    v-model="user.email"
                    @input="clearEmailError"
                    @blur="validateEmail"
                    type="email"
                    placeholder="email@domain.com"
                />
            </b-field>

            <!-- PASSWORD -->
            <b-field
                label="Password"
                :type="{ 'is-danger': !passwordValid || !loginValid }"
            >
                <template v-slot:message>
                    {{ passwordError }}
                </template>
                <b-input
                    v-model="user.password"
                    @input="clearPasswordError"
                    @blur="validatePassword"
                    type="password"
                    placeholder="password"
                    password-reveal
                ></b-input>
            </b-field>

            <!-- SUBMIT -->
            <div class="control">
                <button
                    @click="validateForm"
                    :class="{ 'is-loading': formValidating }"
                    class="button is-primary"
                >
                    Login
                </button>
            </div>
        </div>
    </div>
</template>



<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';


export default defineComponent({
    setup() {
        // LOCAL
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9][a-zA-Z0-9-]{1,252}(?:\.[a-zA-Z0-9]{2,})+$/
        // DOM CONTROLL
        const emailValid = ref(true);       // show warning on field
        const emailError = ref('');         // error content
        const passwordValid = ref(true);
        const passwordError = ref('');
        const loginValid = ref(true);
        const loginError = ref('');
        const formValidating = ref(false);
        // INPUTS VALUE REF
        const user = ref({
            email: '',
            password: ''
        });

        // METHODS
        function validateEmail(): boolean {
            if (emailRegex.test(user.value.email)) {
                emailValid.value = true;

                return true;
            }
            else if (user.value.email.length) {
                emailError.value = 'This is not a valid email!';
                emailValid.value = false;
            }
            else {
                emailError.value = 'This field is required!';
                emailValid.value = false;
            }

            return false;
        }

        function clearEmailError(): void {
            emailValid.value = true;
            emailError.value = '';
        }

        function validatePassword(): boolean {
            if (user.value.password.length) {
                passwordValid.value = true;

                return true;
            }
            else {
                passwordError.value = 'This field is required!';
                passwordValid.value = false;

                return false;
            }
        }

        function clearPasswordError(): void {
            passwordValid.value = true;
            passwordError.value = '';
        }

        async function validateForm(): Promise<void> {
            formValidating.value = true;
            // doing like this to avoid short-circuit evaluation in the if below
            const emailOk = validateEmail();
            const passwordOk = validatePassword();

            if (emailOk && passwordOk) {
                console.log('Email and password valid!!');
                await new Promise(r => setTimeout(r, 2000));
                alert('You have been logged in... or maybe not!')
            }

            formValidating.value = false;
        }

        return {
            // email validation
            emailValid,
            emailError,
            validateEmail,
            clearEmailError,
            // password validation
            passwordValid,
            passwordError,
            validatePassword,
            clearPasswordError,
            // form error
            loginValid,
            loginError,
            // form validation
            formValidating,
            validateForm,
            // form values ref
            user
        }
    }
});

</script>
