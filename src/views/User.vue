<template>
    <div class="user">
        <!-- 头部 -->
        <div class="header">
            <img class="logo" :src="user.avatar" alt="">
            <div class="infor">
                <span class="name">{{user.username}}</span>
                <span class="tag">{{ user.signature }}</span>
            </div>
        </div>
        <!-- 操作列表 -->
        <div class="content">
            <van-cell 
                title="修改个性签名" 
                icon="edit" 
                is-link 
                @click="tagVisible=true"/>
            <van-cell 
                title="账户安全" 
                icon="setting-o" 
                is-link 
                @click="goTo('/account')"/>
            <van-cell 
                title="软件评分" 
                icon="good-job-o" 
                is-link 
                @click="rateVisible=true"/>
            <van-cell 
                title="关于我们" 
                icon="smile-o" 
                is-link
                @click="goTo('/about')"/>
            <van-dialog 
                v-model:show="tagVisible" 
                title="个性签名" 
                show-cancel-button
                @confirm="confirmChange">
                <van-cell-group inset>
                    <van-field
                        v-model="tempSignature"
                        rows="2"
                        autosize    
                        type="textarea"
                        maxlength="20"
                        show-word-limit
                    />
                </van-cell-group>
            </van-dialog>
            <van-dialog v-model:show="rateVisible" title="软件评分" show-cancel-button>
                <van-cell-group inset>
                    <van-rate v-model="rate" allow-half />
                </van-cell-group>
            </van-dialog>
        </div>
    </div>
</template>

<script lang="ts" name="User" setup>
import {onBeforeMount, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../utils/axios'

let router = useRouter()
let tagVisible = ref(false)//个性签名弹出框
let rateVisible = ref(false)//评分弹出框
let user = reactive({//用户信息
    avatar:'',
    username:'',
    signature:'',
})
let tempSignature = ref('')//个性签名
let rate = ref(4.5)//评分

onBeforeMount(()=>{
    loadData()  
})
// 加载用户信息
async function loadData(){
    const { data } = await axios.get("/user/get_userinfo");
    user.avatar = data.avatar
    user.username = data.username
    user.signature = data.signature
    tempSignature.value = user.signature
    
}
function goTo(path:string){
    router.push(path)
}
// 确认修改个性签名
async function confirmChange(){
    user.signature = tempSignature.value
    const { data } = await axios.post('/user/edit_signature', {
        signature: user.signature
    })
    console.log(data);
}
</script>

<style scoped lang="scss">
.user{
    min-height: 100%;
    background-color: $primary-bg;
    padding: 15px;
    .header{
        display: flex;
        align-items: center;
        padding: 10px;
        background-color: $primary;
        border-radius: 5px;
        margin-bottom: 12px;
        .logo{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 2px solid white;
            margin-right: 10px;
        }
        .infor{
            display: flex;
            flex-direction: column;
            color: white;
            .name{
                font-size: 20px;
            }
            .tag{
                font-size: 8px;
                background-color: rgba($color: #000000, $alpha: .1);
                padding: 0px 5px;
                border-radius: 15px;
            }
        }
    }
    .content{
        .van-cell-group--inset{
            text-align: center;
            padding: 15px 0;
        }
    }
}

</style>