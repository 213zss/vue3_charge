<template>
    <!-- 头部 -->
    <van-nav-bar
        :title="type==='login'?'登录':'注册'"
        left-text="返回"
        left-arrow
        @click-left="back"
        fixed="true"
        />
    <!-- 登录,注册 -->
    <div class="container">
        <img class="logo" src="https://pic3.zhimg.com/v2-c27045c61ad770c1a13b9c1c5dc01c5a_r.jpg?source=1940ef5c" alt="">
        <!-- 登录 -->
        <van-form @submit="onSubmit" v-if="type == 'login'">
            <van-cell-group inset>
                <van-field
                v-model="username"
                name="账号"
                label="账号"
                placeholder="请输入账号"
                :rules="[{ required: true, message: '请输入账号' }]"
                />
                <van-field
                v-model="password"
                type="password"
                name="密码"
                label="密码"
                placeholder="请输入密码"
                :rules="[{ required: true, message: '请输入密码' }]"
                />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                登录
                </van-button>
                <p  class="change" @click="chanegType('register')">
                没有账号，前往注册
                </p>
            </div>
        </van-form>
        <!-- 注册 -->
        <van-form @submit="onSubmit" v-if="type == 'register'">
            <van-cell-group inset>
                <van-field
                v-model="username"
                name="账号"
                label="账号"
                placeholder="请输入账号"
                :rules="[{ required: true, message: '请输入账号' }]"
                />
                <van-field
                v-model="password"
                type="password"
                name="密码"
                label="密码"
                placeholder="请输入密码"
                :rules="[{ required: true, message: '请输入密码' }]"
                />
                <van-field
                    v-model="verify"
                    name="验证码"
                    label="验证码"
                    placeholder="输入验证码"
                >
                    <template #button>
                        <VueImageVerify ref="verifyRef"></VueImageVerify>
                    </template>
                </van-field>
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                注册
                </van-button>
                <p  class="change" @click="chanegType('login')">
                    登录已有账号
                </p>
            </div>
        </van-form>

    </div>
</template>

<script lang="ts" name="Login" setup>
import VueImageVerify from '../components/VueImageVerify.vue'
import axios from '../utils/axios'
import { ref } from 'vue'
import {useRouter} from 'vue-router'
const router = useRouter();
let username = ref('')//用户名
let password = ref('')//密码
let type = ref('login')//登录?注册
let verify = ref('')// 验证码输入框输入的内容
let imgCode = ref('')// 生成的验证图片内的文字
let verifyRef = ref(null)

//返回上一级
function back(){
    router.back();
}
// 登录，注册
async function onSubmit(){
    // 登录
    if(type.value == 'login'){
        const { data } = await axios.post('/user/login', {
            username: username.value,
            password: password.value
        })
        localStorage.setItem('token',data.token)
        router.push('/home')
    }
    // 注册
    else{
        if(imgCode.value!=verify.value){
            showFailToast('验证码错误');
        }
        else{
            const { data } = axios.post('/user/register', {
                username: username.value,
                password: password.value
            })   
        }
    }
     
}
// 登录?注册
function chanegType(val){
    type.value = val
}
</script>

<style scoped lang="scss">
.container{
    height: calc(100% - 40px);
    padding: 80px 20px 0 20px;
    min-height: 100%;
    background-color: $primary-bg;
    .logo{
        display: block;
        width: 150px;
        margin: 0 auto;
        margin-bottom: 30px;
    }
    .change{
        text-align: center;
        margin: 10px 0;
        color: #597fe7;
        font-size: 14px;
    }
    .van-cell-group--inset{
        margin: 0;
        .van-field{
            align-items: center;
        }
    }
    
}
</style>