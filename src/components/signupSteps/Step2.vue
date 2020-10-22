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
                @input="
                    clearError('firstName');
                    firstNameValidation.done = false;
                "
                @blur="validateName('firstName')"
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
                @input="
                    clearError('lastName');
                    lastNameValidation.done = false;
                "
                @blur="validateName('lastName')"
                type="text"
                placeholder="last name"
            />
        </b-field>

        <!-- BIRTH DATE -->
        <b-field label="Select a date">
            <b-datepicker placeholder="Click to select..."> </b-datepicker>
        </b-field>
    </b-step-item>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';


export default defineComponent({
    setup() {

        const nameRegex = /^[\p{L}][ \p{L}'-]*[\p{L}]$/u

        const firstNameValidation = ref({
            error: false,
            errorMessage: '',
            done: false
        });

        const lastNameValidation = ref({
            error: false,
            errorMessage: '',
            done: false
        });

        const user = ref({
            firstName: '',
            lastName: '',
            phoneNumber: ''
        });

        function clearError(field: 'firstName' | 'lastName'): void {
            if (field === 'firstName') {
                firstNameValidation.value.error = false;
                firstNameValidation.value.errorMessage = '';
            }
            else if (field === 'lastName') {
                lastNameValidation.value.error = false;
                lastNameValidation.value.errorMessage = '';
            }
            // else if (field === 'repeatPassword') {
            //     repeatPasswordError.value = false;
            //     repeatPasswordErrorMessage.value = '';
            // }
            else {
                console.log(`Error clear not implemented for '${field}'!`);
            }
        }

        function validateName(field: 'firstName' | 'lastName'): boolean {

            if (nameRegex.test(user.value[field])) {
                clearError(field);

                return true;
            }
            else {
                if (field === 'firstName') {
                    firstNameValidation.value.error = true;
                    firstNameValidation.value.errorMessage = 'Illegal character inserted. Plesae use only lowecase and uppercase letter, space, dash and apostrophe';
                }
                else if (field === 'lastName') {
                    lastNameValidation.value.error = true;
                    lastNameValidation.value.errorMessage = 'Illegal character inserted. Plesae use only lowecase and uppercase letter, space, dash and apostrophe';
                }
            }

        return false;
    }


        return {
        //user info
        user,
        // validation
        firstNameValidation,
        validateName,
        // general
        clearError
    }
}
});

</script>
