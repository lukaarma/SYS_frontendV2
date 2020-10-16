<template>
    <div class="app_root">
        <Navbar />
        <router-view />
    </div>
</template>


<script lang="ts">
import Navbar from "./components/Navbar.vue";

export default {
    components: {
        Navbar,
    },
};
</script>
