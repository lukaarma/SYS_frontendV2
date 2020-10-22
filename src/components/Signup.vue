<template>
    <div class="modal-card">
        <div class="modal-card-body">
            <b-steps
                v-model="activeFormStep"
                animated
                rounded
                mobile-mode="compact"
                :has-navigation="false"
            >
                <Step1 @goNext="activeFormStep++"/>
                <b-step-item step="3" label="test">
                    <h1 class="title has-text-centered">Account</h1>
                    Lorem ipsum dolor sit amet.
                </b-step-item>
                <Step2 />
            </b-steps>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import Step1 from './signupSteps/Step1.vue';
import Step2 from './signupSteps/Step2.vue';


export default defineComponent({
    components: {
        Step1,
        Step2
    },
    setup() {
        // steps variables
        const activeFormStep = ref(0);

        return {
            // step form varibales
            activeFormStep
        }
    }
});

</script>
