<template>
    <form @submit.prevent="submitForm">
        <!-- FIRST_NAME -->
        <div class="field">
            <label class="label"> Fist name </label>
            <div class="control has-icons-left">
                <input v-model="user.firstName" :class="{ 'is-success': user.firstName.length }"
                class="input" type="text" required>

                <span class="icon is-small is-left">
                <i class="far fa-id-card"></i>
            </span>
            </div>
        </div>

        <!-- LAST_NAME -->
        <div class="field">
            <label class="label"> Last name </label>
            <div class="control has-icons-left">
                <input v-model="user.lastName" :class="{ 'is-success': user.lastName.length }"
                class="input" type="text" required>

                <span class="icon is-small is-left">
                    <i class="far fa-id-card"></i>
                </span>
            </div>
        </div>

        <!-- USERNAME -->
        <div class="field">
            <label class="label">Username</label>
            <div class="control has-icons-left">
                <!-- @blur="resetDebounce" -->
                <input
                    @input="debounce" v-model="user.username"
                    :class="{ 'is-success': usernameValid === true, 'is-danger': usernameValid === false | usernameShort }"
                    class="input" type="text" placeholder="username" required
                >
                <span class="icon is-small is-left">
                    <i class="fas fa-user"></i>
                </span>
            </div>
            <p v-if="usernameValid === false" class="help is-danger">This username is not available</p>
            <p v-else-if="usernameShort" class="help is-danger"> The username is too short </p>
        </div>

        <!-- PASSWORD -->
        <div class="field">
            <label class="label">Password</label>
            <div class="control has-icons-left has-icons-right">
                <span class="icon is-small is-left">
                    <i class="fas fa-key"></i>
                </span>

                <input :type="passwordVisible ? 'text' : 'password'"
                class="input" placeholder="password" id="passwordInput" required>

                    <!-- questo è uno span per cliccare sull'icona -->
                <span class="click-icon icon is-small is-right" @click="togglePassword('passwordInput')">
                    <svg v-show="passwordVisible" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 3c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z"/></svg>
                    <svg v-show="!passwordVisible" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19.604 2.562l-3.346 3.137c-1.27-.428-2.686-.699-4.243-.699-7.569 0-12.015 6.551-12.015 6.551s1.928 2.951 5.146 5.138l-2.911 2.909 1.414 1.414 17.37-17.035-1.415-1.415zm-6.016 5.779c-3.288-1.453-6.681 1.908-5.265 5.206l-1.726 1.707c-1.814-1.16-3.225-2.65-4.06-3.66 1.493-1.648 4.817-4.594 9.478-4.594.927 0 1.796.119 2.61.315l-1.037 1.026zm-2.883 7.431l5.09-4.993c1.017 3.111-2.003 6.067-5.09 4.993zm13.295-4.221s-4.252 7.449-11.985 7.449c-1.379 0-2.662-.291-3.851-.737l1.614-1.583c.715.193 1.458.32 2.237.32 4.791 0 8.104-3.527 9.504-5.364-.729-.822-1.956-1.99-3.587-2.952l1.489-1.46c2.982 1.9 4.579 4.327 4.579 4.327z"/></svg>
                </span>
            </div>
        </div>

        <vue-tel-input v-model="phone"></vue-tel-input>

        <!-- SUBMIT -->
        <div class="control">
            <button class="button is-link"> Register </button>
        </div>
    </form>
</template>


<script lang="ts">

import { defineComponent, ref } from '@vue/composition-api';

type CustomEvent = EventTarget & {
    value: string;
}

export default defineComponent({
    setup() {

        const phone = ref();

        const usernameValid = ref(undefined);
        const usernameShort = ref(false);
        const passwordVisible = ref(false);
        const user = ref({
            firstName: '',
            lastName: '',
            username: '',
            password: ''
        });

        let timeoutRef: number | undefined;
        let debounceValue: string;


        function debounce(el: Event) {
            if (timeoutRef) {
                clearTimeout(timeoutRef);
            }
            debounceValue = (el.target as CustomEvent).value;

            // if the username was flagged as short but it's now longer remove the flag
            if (usernameShort.value && debounceValue.length > 5) {
                usernameShort.value = false;
            }


            timeoutRef = setTimeout(() => {
                if (debounceValue.length > 3) {
                    console.log(`I would check '${debounceValue}' against the database!`);
                }
                else {
                    usernameShort.value = true;
                    console.log(`I would NOT check '${debounceValue}' against the database!`);
                }
            }, 1000);
        }

        function togglePassword(target: string) {
            console.log(target)
            passwordVisible.value = !passwordVisible.value

            const $target = document.getElementById(target);
            if ($target) {
                $target.focus();
            }
        }


        return {
            // user infos
            user,
            // username related flags
            usernameValid,
            usernameShort,
            // password related flags
            passwordVisible,
            togglePassword,
            // funtions
            debounce,
            phone
        }
    }
});

</script>
