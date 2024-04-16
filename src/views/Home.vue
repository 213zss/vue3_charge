<template>
   <div class="home">
      <!-- 头部 -->
      <div class="header">
         <!-- 类型选择 -->
         <div class="type" @click="typeVisible=true">
            <span class="type-title">全部类型</span>
            <van-icon name="apps-o" />
         </div>
         <van-action-sheet v-model:show="typeVisible" title="请选择类型">
            <div class="content">
                  <div
                     @click="choseType({ id: 'all' })"
                     :class="{ all:true , active: active == 'all' }"
                  >
                     全部类型
                  </div>
                  <div class="title">支出</div>
                  <div class="expense-wrap">
                     <p
                        @click="choseType(item)"
                        :class="{active: active == item.id}"
                        v-for="item in expense"
                        :key="item"
                     >
                        {{ item.name }}
                     </p>
                  </div>
                  <div class="title">收入</div>
                  <div class="income-wrap">
                     <p
                        @click="choseType(item)"
                        :class="{active: active == item.id}"
                        v-for="item in income"
                        :key="item"
                     >
                        {{ item.name }}
                     </p>
                  </div>
            </div>
         </van-action-sheet>
         <!-- 日期选择 -->
         <div class="date">
            <span class="time" @click="dateSelectToggle">{{dateSelect}}</span>
            <span class="expense">总支出 ¥{{totalExpense}}</span>
            <span class="income">总收入 ¥{{totalIncome}}</span>
         </div>
         <!-- 选择时间 -->
         <DateSelect 
            @currentDate="currentDate"
            @selectMonth="selectMonth" 
            ref="dateSelectRef">
         </DateSelect>
      </div>
      <!-- 账单列表 -->
      <div class="card">
         <van-pull-refresh 
            v-model="refreshing" 
            @refresh="onRefresh">
            <van-list
               v-model:loading="loading"
               :finished="finished"
               finished-text="没有更多了"
               @load="onLoad"
            >
               <!-- <CardItem :list="list"></CardItem> -->
               <CardItem v-for="item in list" :list="item" :key="item" />
            </van-list>
         </van-pull-refresh>
      </div>
      <!-- 添加账单悬浮按钮 -->
      <van-floating-bubble
         axis="xy"
         icon="records-o"
         magnetic="x"
         @click="addToggle"
         />
      <AddBill ref="addRef"></AddBill>
   </div>
</template>

<script lang="ts" name="Home" setup>
import axios from '../utils/axios'
import CardItem from '../components/CardItem.vue'
import AddBill from '../components/AddBill.vue'
import DateSelect from '../components/DateSelect.vue'
import { reactive, ref,onBeforeMount,defineExpose } from 'vue'

// 类型选择
let typeVisible = ref(false)//类型选择的操作面板
let active = ref('all')
let expense = reactive([])
let income = reactive([])
//日期选择
let dateSelectRef = ref(null)
let dateSelect = ref('')
// 下拉刷新
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const list = ref([])
let totalPage = ref(0)
let page = ref(1)
let totalExpense = ref(0)//总支出
let totalIncome = ref(0)//总收入
let addRef = ref(null)//添加账单的操作面板

onBeforeMount(()=>{
   loadTypeData()  

})

// 选择类型
function choseType(val:object){
   active.value = val.id
   typeVisible.value = false
}
//加载类型数据
async function loadTypeData(){
    const {
        data: { list },
      } = await axios.get("/type/list");
      // i.type = 1 的为支出的标签类型
      expense = list.filter((i) => i.type == 1);
      // i.type = 2 的为收入的标签类型
      income = list.filter((i) => i.type == 2);
}

//日期选择显示与隐藏
function dateSelectToggle(){
   dateSelectRef.value.toggle()
}
// 初始化当前日期
function currentDate(val){
   dateSelect.value = val
}
// 日期选择
function selectMonth(val){
   if(val){
      dateSelect.value = val
   }
   getBillList()
}

// 刷新内容
function onRefresh(){
  finished.value = false;
  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
}
// 加载内容
function onLoad(){
   // 当不是下拉刷新且当前页 page 小于总页数 totalPage，需要加载下一页的数据
   if (!refreshing.value && page.value < totalPage.value) {
         page.value += 1
   }
   getBillList()
}
// 获得账单信息
async function getBillList(){
   const {data} = await axios.get(`/bill/list?date=${dateSelect.value}&type_id=${active.value}&page=${page.value}&page_size=5`)
   totalExpense.value = data.totalExpense
   totalIncome.value = data.totalIncome
   //如果刷新，则上次的内容清空
   if (refreshing.value) {
      list.value = [];
      refreshing.value = false;
   }
   loading.value = false;
   list.value = list.value.concat(data.list)
   totalPage.value = data.totalPage
   // 如果当前页 page 大于等于总页数 totalPage，则代表数据已经请求完，将 finished 设置为 true。
   if (page.value >= totalPage.value) finished.value = true
  
}

//添加账单显示与隐藏
function addToggle(){
   addRef.value.toggle()
}

</script>

<style lang='scss' scoped>
.home{
   height: 100%;
   background-color: $primary-bg;
   .header{ 
      display: flex;
      flex-direction: column;
      background-color: $primary;
      padding: 10px 20px;
      color: white;
      font-size: 14px;

      .type{
         position: relative;
         display: flex;
         align-items: center;
         background-color:rgba($color: #fff, $alpha: .2);
         padding: 5px;
         border-radius: 4px;
         margin-bottom: 5px;
         align-self: baseline;
         .type-title{
            margin-right: 25px;
         }
         .type-title::after{
            content: '';
            position: absolute;
            top: 12px;
            bottom: 11px;
            right: 35px;
            width: 1px;
            background-color: #e9e9e9;
         }
         i{
            font-size: 19px;
         }
      }
      .content{
         padding: 20px;
         background-color: $primary-bg;
         .active {
            background-color: $primary!important;
            color: #fff;
         }
         .all{
            display: inline-block;
            padding: 12px 20px;
            font-size: 16px;
            background-color: white;
         }
         .title {
            margin: 10px 0;
            font-size: 14px;
         }
         .expense-wrap,
         .income-wrap {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            p {
               width: calc((100% - 20px) / 3);
               text-align: center;
               padding: 12px 0;
               margin-bottom: 10px;
               background-color: #fff;
               font-size: 16px;
            }
         }
      }
      .date{
         .time{
            position: relative;
            margin-right: 30px;
         }
         .time::after{
            position: absolute;
            content: "";
            top: 7px;
            left: 55px; 
            border-width: 5px; /* 定义三角形的大小 */
            border-style: solid;
            border-color: white transparent transparent transparent; /* 定义三角形的颜色和边框 */
         }

         .expense{
            margin-right: 8px;
         }
      }
      
   }
   .card{
      padding: 10px;
      height: calc(100% - 130px);
      overflow: hidden;
      overflow-y: scroll;
   }
   
   .add{
         .top {
            display: flex;
            justify-content: space-between;
            padding: 10px 24px 0 24px;
            .close {
               display: flex;
               align-items: center;
               font-size: 20px;

            }
            .add-btn {
               padding: 0 12px;
               border-color: $primary;
            }
         }
         .type-time{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 24px;
            .type {
               span {
                  display: inline-block;
                  padding: 4px 12px;
                  font-size: 12px;
                  border-radius: 24px;
                  border: 1px solid #f5f5f5;
                  color: black;
               }
               .expense {
                  margin-right: 6px;
                  &.active {
                     background-color: #e9f3fd;
                     border-color: $primary;
                     color: $primary;
                  }
               }
               .income {
                  &.active {
                     background-color: #fbf8f0;
                     border-color: $text-warning;
                     color: $text-warning;
                  }
               }
            }
            .time {
               display: flex;
               justify-content: center;
               align-items: center;
               padding: 4px 12px;
               background-color: #f0f0f0;
               border-radius: 20px;
               // color: @color-text-base;
               .sort-down {
               font-size: 12px;
               margin-left: 5px;
               }
            }
         }
         .money{
            display: flex;
            align-items: center;
            margin: 0 24px;
            padding-bottom: 5px;
            border-bottom: 1px solid #e9e9e9;
            span{
               font-size: 35px;
               font-weight: 800;
               margin-right: 5px;
            }
            .van-field{
               font-size: 35px;
               
            }
         }
         .type-icon {
            display: flex;
            overflow-x: auto;
            margin: 0 24px;
            margin-bottom: 20px;
            .type-body {
               display: flex;
               white-space: nowrap;
               .type-item {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  padding: 16px 12px 10px 12px;
                  .iconfont-wrap {
                     display: flex;
                     justify-content: center;
                     align-items: center;
                     background-color: #f5f5f5;
                     border-radius: 50%;
                     width: 30px;
                     height: 30px;
                     margin-bottom: 5px;
                     .iconfont {
                        color: rgba(0, 0, 0, 0.5);
                        font-size: 20px;
                     }
                  }
                  .expense {
                     &.active {
                     background-color: $primary;
                     .iconfont {
                        color: #fff;
                        }
                     }
                  }
                  .income {
                     &.active {
                     background-color: $text-warning;
                     .iconfont {
                        color: #fff;
                        }
                     }
                  }
               }
            }
         }
         .remark{
            padding: 0 24px;
            padding-bottom: 12px;
            color: #4b67e2;

         }
         .van-number-keyboard{
            position: relative;
         }
   }
}
</style>
