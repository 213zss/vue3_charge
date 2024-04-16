<template>
    <!-- 顶部导航栏 -->
    <van-nav-bar
        title="账户安全"
        left-text="返回"
        left-arrow
        @click-left="back"
        fixed="true"
        />
     <!-- 修改密码,退出登录 -->
    <div class="account"> 
        <van-cell 
            class="change"
            title="密码修改" 
            is-link 
            @click="passwordVisible=true"/>
        <van-dialog 
            v-model:show="passwordVisible" 
            title="修改密码" 
            show-cancel-button
            @confirm="confirm"
            @cancel="cancel">
            <van-cell-group inset>
                <van-field 
                    clearable
                    v-model="oldPass" 
                    type="password" 
                    label="原密码" 
                    placeholder="请输入原密码" />
            </van-cell-group>
            <van-cell-group inset>
                <van-field 
                    clearable
                    v-model="newPass1" 
                    type="password" 
                    label="新密码" 
                    placeholder="请输入新密码" />
            </van-cell-group>
            <van-cell-group inset>
                <van-field 
                    clearable
                    v-model="newPass2" 
                    type="password" 
                    label="确认密码" 
                    placeholder="再次输入确认" />
            </van-cell-group>
        </van-dialog>
        <van-button round block type="primary" native-type="submit" class="logout" @click="layOut">
            退出登录
        </van-button>
    </div>
</template>


<script lang="ts" name="Account" setup>
import axios from 'axios';
import { showToast } from 'vant';
import { ref } from 'vue'
import {useRouter} from 'vue-router'
const router = useRouter();
let passwordVisible = ref(false)
let oldPass = ref('')
let newPass1 = ref('')
let newPass2 = ref('')

//返回上一级
function back(){
    router.back();
}
// 确认修改密码
function confirm(){
    const {msg} = axios.post('/user/modify_pass',{
        new_pass:newPass1.value,
        new_pass2:newPass2.value,
        old_pass:oldPass.value
    })
    passwordVisible.value = false

    showToast(msg);
    clear()
}
// 取消修改密码
function cancel(){
    clear()
}
function clear(){
    oldPass.value = ''
    newPass1.value = ''
    newPass2.value = ''
}
// 退出登录
function layOut(){
    router.push('/login')
}
</script>


<style scoped lang="scss">
.account{
    height: calc(100% - 16px);
    position: relative;
    padding: 45px 0 20px;
    min-height: 100%;
    background-color: $primary-bg;
    .change{
        margin-bottom: 20px;
    }
    .logout{
        width: 90%;
        margin: 0 auto;
    }
}
</style>