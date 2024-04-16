<template>
    <div class="detail">
        <!-- 顶部导航栏 -->
        <van-nav-bar
            title="账单详情"
            left-text="返回"
            left-arrow
            @click-left="back"
            fixed="true"
            />
        <!-- 账单详情内容 -->
        <div class="card">
            <div 
                class="type"
                :class="{expense:detail.pay_type==1?true:false,
                        income:detail.pay_type==2?true:false}">
                <span class="type-icon">
                    <i  class="iconfont" 
                        :class="detail.type_id ? typeMap[detail.type_id].icon : 0"></i>
                </span>
                <span>{{detail.type_name}}</span>
            </div>
            <div class="amount">{{detail.pay_type==1?'-':'+'}}{{detail.amount}}</div>
            <div class="info">
                <div class="time">
                    <span>记录时间</span>
                    <span>{{detail.date}}</span>
                </div>
                <div class="remark">
                    <span>备注</span>
                    <span>{{detail.remark?detail.remark:'-'}}</span>
                </div>
            </div>
            <!-- 编辑,删除按钮 -->
            <div class="operation van-hairline--top">
                <span class="van-hairline--right" @click="deleteVisible=true">
                    <van-icon name="delete" />
                    删除
                </span>
                <span @click="editToggle">
                    <van-icon name="edit" />
                    编辑
                </span>
                <AddBill 
                    @refresh="updateDetail"
                    ref="editRef"
                    :detail="detail"></AddBill>
            </div>
            <van-dialog 
                v-model:show="deleteVisible" 
                title="删除" 
                show-cancel-button
                @confirm="confirmDelete">
                <div class="askContent">确认删除账单？</div>
            </van-dialog>
        </div>
    </div>
</template>

<script lang="ts" name="" setup>
import axios from 'axios';
import {ref,onMounted, reactive} from 'vue'
import { typeMap } from '../utils'
import {useRouter} from 'vue-router'
import { showSuccessToast } from 'vant';
const router = useRouter();
let id = ref('');
let detail = reactive({})
let deleteVisible = ref(false)
let editRef = ref(null)//编辑账单的操作面板

onMounted(() => {
    id.value=router.currentRoute.value.query.id;
    onLoad()
});
// 加载数据
async function onLoad(){
    const { data } = await axios.get("/bill/detail", {
        params: {
            id: id.value,
        },
    });
    Object.assign(detail, data)
    detail.date = formatTimestampToTime(data.date)
}
//返回上一级
function back(){
    router.back();
}
//时间戳格式化为年-月-日 时:分:秒
function formatTimestampToTime(timestamp:string) {
  // 创建一个 Date 对象，传入时间戳作为参数
    const date = new Date(parseInt(timestamp));
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从 0 开始，需要加 1
    const day = ('0' + date.getDate()).slice(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const minute = ('0' + date.getMinutes()).slice(-2);
    const second = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
//删除
function confirmDelete(){
    console.log(id.value);
    axios.post('bill/delete',{
        id:id.value
    })
    showSuccessToast('删除成功')
    router.back();
}

// 编辑账单显示与隐藏
function editToggle(){
    editRef.value.toggle()
}
// 编辑后更新数据
function updateDetail(){
    onLoad()
}
</script>

<style scoped lang="scss">
.detail{
    padding: 60px 24px 0 24px;
    min-height: 100%;
    background-color: $primary-bg;
    .card {
        border-radius: 12px;
        background-color: white;
        padding: 0 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .type{
            display: flex;
            align-items: center;
            padding: 24px 0 10px 0;
            .type-icon{
                display: inline-block;
                width: 22px;
                height: 22px;
                color: white;
                background-color: $primary;
                border-radius: 50%;
                text-align: center;
                margin-right: 8px;
                i{
                    font-size: 16x;
                    line-height: 22px;
                }
            }
        }
        .expense{
            span:nth-of-type(1) {
                background-color: $primary;
            }          
        }
        .income {
            span:nth-of-type(1) {
                background-color: $text-warning;
            }         
        }
        .amount {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .info {
            width: 100%;
            font-size: 14px;
            .time,
            .remark{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin-bottom: 12px;
                span:nth-of-type(1) {
                    flex: 1;
                    color: rgba($color: #000000, $alpha: .5);
                }
                span:nth-of-type(2) {
                    flex: 3;
                    color: black;
                }
            }
        }
        .operation {
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
            font-size: 16px;
            .van-icon {
                margin-right: 4px;
            }
            span {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                flex: 1
            }
            span:nth-of-type(1) {
                color: red;
            }
        }
        .askContent{
            text-align: center;
            padding: 10px 0 20px 0;
        }
    }
}

</style>