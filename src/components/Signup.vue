<template>
    <div class="modal-card">
        <header class="modal-card-head has-text-centered">
            <p class="modal-card-title"> Sign Up </p>
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
                <Step1 @goNext="activeFormStep++" />
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
        const activeFormStep = ref(1); //TODO set to 0

        return {
            // step form varibales
            activeFormStep
        }
    }
});

</script>
