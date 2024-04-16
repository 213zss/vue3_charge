<template>
    <!-- 底部导航栏 -->
    <van-tabbar v-model="active">
        <van-tabbar-item icon="notes-o" @click="goTo('/home')">明细</van-tabbar-item>
        <van-tabbar-item icon="bar-chart-o" @click="goTo('/data')">统计</van-tabbar-item>
        <van-tabbar-item icon="friends-o" @click="goTo('/user')">我的</van-tabbar-item>
    </van-tabbar>
</template>

<script lang="ts" name="NavBar" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
const active = ref(0);
const router=useRouter()
function goTo(path:string){
    router.push(path)
}
</script>

<style scoped>

</style>