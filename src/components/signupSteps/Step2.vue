<template>
    <b-step-item step="2" label="Personal Info">
        <!-- FIRST NAME -->
        <b-field
            label="First Name"
            :type="{ 'is-danger': firstNameValidation.error }"
        >
            <template v-slot:message>
                {{ firstNameValidation.errorMessage }}
            </template>
            <b-input
                v-model="user.firstName"
                :disabled="disableAll"
                @input="clearError('firstName')"
                @blur="validateFirstName"
                type="text"
                placeholder="first name"
            />
        </b-field>

        <!-- LAST NAME -->
        <b-field
            label="Last Name"
            :type="{ 'is-danger': lastNameValidation.error }"
        >
            <template v-slot:message>
                {{ lastNameValidation.errorMessage }}
            </template>
            <b-input
                v-model="user.lastName"
                :disabled="disableAll"
                @input="clearError('lastName')"
                @blur="validateLastName"
                type="text"
                placeholder="last name"
            />
        </b-field>

        <!-- BIRTH DATE -->
        <b-field
            label="Birthdate"
            :type="{ 'is-danger': birthdateValidation.error }"
        >
            <template v-slot:message>
                {{ birthdateValidation.errorMessage }}
            </template>
            <div class="has-text-centered">
                <b-datepicker
                    v-model="user.birthdate"
                    :first-day-of-week="1"
                    :max-date="birthdateValidation.maxDate"
                    @input="clearError('birthdate')"
                    @blur="validateBirthdate"
                    append-to-body
                    position="is-top-right"
                />
            </div>
        </b-field>

        <!--PHONE-->
        <b-field
            label="Phone number"
            :type="{ 'is-danger': phoneNumberValidation.error }"
        >
            <template v-slot:message>
                {{ phoneNumberValidation.errorMessage }}
            </template>
            <VueTelInput
                v-model="user.phoneNumber"
                :inputClasses="{
                    'input phoneInput': true,
                    'is-danger': phoneNumberValidation.error,
                }"
                @validate="phoneChangeState"
                @input="clearError('phoneNumber')"
                @blur="validatePhoneNumber"
                dynamicPlaceholder
                validCharactersOnly
            />
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
</template>


<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { VueTelInput } from 'vue-tel-input';


export default defineComponent({
    components: {
        VueTelInput,
    },
    setup(props, { emit }) {
        const nameRegex = /^[\p{L}][ \p{L}'-]*[\p{L}]$/u
        const notNameRegex = /[^\p{L} '-]/u

        const user = ref({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            birthdate: undefined
        });

        const stepValidating = ref(false);
        const disableAll = ref(false);

        const firstNameValidation = ref({
            error: false,
            errorMessage: ''
        });
        const lastNameValidation = ref({
            error: false,
            errorMessage: ''
        });

        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 14)
        const birthdateValidation = ref({
            maxDate,
            error: false,
            errorMessage: ''
        });

        const phoneNumberValidation = ref({
            error: false,
            errorMessage: '',
            isValid: false
        });


        function validateFirstName(): boolean {
            if (user.value.firstName && nameRegex.test(user.value.firstName)) {
                return true;
            }
            else if (user.value.firstName && notNameRegex.test(user.value.firstName)) {
                firstNameValidation.value.errorMessage = 'Illegal character inserted. ' +
                    'Plesae use only lowecase and uppercase letter, space, dash and apostrophe';
            }
            else if (user.value.firstName.length === 1) {
                firstNameValidation.value.errorMessage = 'The name is too short';
            }
            else if (!user.value.firstName.length) {
                firstNameValidation.value.errorMessage = 'Field is required!';
            }

            firstNameValidation.value.errorMessage ? firstNameValidation.value.error = true : null;

            return false;
        }

        function validateLastName(): boolean {
            if (user.value.lastName && nameRegex.test(user.value.lastName)) {
                return true;
            }
            else if (user.value.lastName && notNameRegex.test(user.value.lastName)) {
                lastNameValidation.value.errorMessage = 'Illegal character inserted. ' +
                    'Plesae use only lowecase and uppercase letter, space, dash and apostrophe';
            }
            else if (user.value.firstName.length === 1) {
                lastNameValidation.value.errorMessage = 'The name is too short';
            }
            else if (!user.value.lastName.length) {
                lastNameValidation.value.errorMessage = 'Field is required!';
            }

            lastNameValidation.value.errorMessage ? lastNameValidation.value.error = true : null
            return false;
        }

        function validateBirthdate(): boolean {
            if (user.value.birthdate) {
                return true;
            }
            else {
                birthdateValidation.value.error = true;
                birthdateValidation.value.errorMessage = 'Field is required!';
            }

            return false;
        }

        function phoneChangeState(args: { isValid: boolean }): void {
            phoneNumberValidation.value.isValid = args.isValid;
        }

        function validatePhoneNumber(): boolean {
            if (user.value.phoneNumber && phoneNumberValidation.value.isValid) {
                return true;
            }
            else if (user.value.phoneNumber) {
                phoneNumberValidation.value.errorMessage = 'This is not a valid phone number'
            }
            else {
                phoneNumberValidation.value.errorMessage = 'This field is required'
            }

            phoneNumberValidation.value.error = true;

            return false;
        }

        function clearError(field: 'firstName' | 'lastName' | 'birthdate' | 'phoneNumber'): void {
            if (field === 'firstName') {
                firstNameValidation.value.error = false;
                firstNameValidation.value.errorMessage = '';
            }
            else if (field === 'lastName') {
                lastNameValidation.value.error = false;
                lastNameValidation.value.errorMessage = '';
            }
            else if (field === 'birthdate') {
                birthdateValidation.value.error = false;
                birthdateValidation.value.errorMessage = '';
            }
            else if (field === 'phoneNumber') {
                phoneNumberValidation.value.error = false;
                phoneNumberValidation.value.errorMessage = '';
            }
            else {
                console.log(`Error clear not implemented for '${field}'!`);
            }
        }

        async function goNextStep(): Promise<void> {
            stepValidating.value = disableAll.value = true;

            const firstNameOk = validateFirstName();
            const lastNameOk = validateLastName();
            const birthdateOk = validateBirthdate();
            const phoneNumberOk = validatePhoneNumber();

            if (firstNameOk && lastNameOk && birthdateOk && phoneNumberOk) {
                alert('GOGO POWER RANGERS!!');
                //TODO: handle event on father
                emit('goNext', user.value.firstName, user.value.lastName, user.value.birthdate, user.value.phoneNumber);
            }

            stepValidating.value = disableAll.value = false;
        }


        return {
            //user info
            user,
            // validation
            firstNameValidation,
            validateFirstName,
            lastNameValidation,
            validateLastName,
            birthdateValidation,
            validateBirthdate,
            phoneNumberValidation,
            validatePhoneNumber,
            phoneChangeState,
            // general
            disableAll,
            stepValidating,
            clearError,
            goNextStep
        }
    }
});

</script>
