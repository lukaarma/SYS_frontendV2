<template>
    <b-step-item step="3" label="Confirm" :clickable="false">
        <b-field
            label="First Name"
            label-position="on-border"
            custom-class="is-medium"
            class="my-4"
        >
            <b-input v-model="user.firstName" readonly size="is-medium" />
        </b-field>
        <!-- LAST NAME -->
        <b-field
            label="Last Name"
            label-position="on-border"
            custom-class="is-medium"
            class="my-4"
        >
            <b-input v-model="user.lastName" readonly size="is-medium" />
        </b-field>
        <!-- BIRTHDATE -->
        <b-field
            label="Birtdate"
            label-position="on-border"
            custom-class="is-medium"
            class="my-4"
        >
            <b-input v-model="user.birthdateValue" readonly size="is-medium" />
        </b-field>
        <!-- PHONE NUMBER -->
        <b-field
            label="Phone number"
            label-position="on-border"
            custom-class="is-medium"
            class="my-4"
        >
            <b-input v-model="user.phoneNumber" readonly size="is-medium" />
        </b-field>
        <!-- EMAIL -->
        <b-field
            label="Email"
            label-position="on-border"
            custom-class="is-medium"
            class="my-4"
        >
            <b-input v-model="user.email" readonly size="is-medium" />
        </b-field>

        <div class="buttons is-right">
            <!-- CANCEL -->
            <b-button
                :type="{ 'is-loading': isValidating }"
                @click="cancel"
                class="is-danger mt-4"
            >
                Cancel
            </b-button>

            <!-- CONFIRM -->
            <b-button
                :type="{ 'is-loading': isValidating }"
                @click="confirm"
                class="is-success mt-4"
            >
                Confirm
            </b-button>
        </div>
    </b-step-item>
</template>


<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { UserProp } from '../Signup.vue';


export default defineComponent({
    props: {
        user: {
            type: Object as PropType<UserProp>,
            required: true
        },
        isValidating: {
            type: Boolean,
            required: true
        }
    },
    setup(props, { emit }) {

        function cancel() {
            emit('cancel');
        }

        function confirm() {
            emit('confirm');
        }

        return {
            cancel,
            confirm
        }
    }
});

</script>
