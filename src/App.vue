<template>
    <RouterView></RouterView>
    <NavBar v-show="show"></NavBar>
</template>

<script lang="ts" name="App" setup>
import {  reactive, ref } from 'vue'
import { RouterLink,RouterView,useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue'
let show=ref(false)
let menu=reactive(['/home','/data','/user'])
let router=useRouter()
  router.afterEach(() => {
    show.value = menu.includes(router.currentRoute.value.path);
  });


</script>

<style scoped lang="scss">

</style>