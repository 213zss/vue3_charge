<template>
    <div class="data">
        <div class="header">
            <div class="time" @click="dateVisible=true">
                <span class="time-text" >{{dateSelect}}</span>
                <van-icon name="notes-o" />
            </div>
            <DateSelect 
                @currentDate="currentDate"
                @selectMonth="selectMonth" 
                v-model:show="dateVisible">
            </DateSelect>
            <div class="title">共支出</div>
            <div class="expense">￥{{ total_expense }}</div>
            <div class="income">共收入￥{{ total_income }}</div>
        </div>
        <div class="structure">
            <div class="head">
                <span class="title">收支构成</span>
                <div class="tab">
                    <span
                        @click="changeTotalType('expense')"
                        class="expense"
                        :class="{ active: totalType == 'expense' }"
                    >
                        支出
                    </span>
                    <span
                        @click="changeTotalType('income')"
                        class="income"
                        :class="{ active: totalType == 'income' }"
                    >
                        收入
                    </span>
                </div>
            </div>
            <div 
                class="item"
                v-for="item in totalType == 'expense' ? expense_data : income_data"
                :key="item.type_id">
                <div class="item-icon">
                    <span :class="{'iconfont-wrap': true,expense: totalType == 'expense', income: totalType == 'income'}">
                        <i class="iconfont" :class="typeMap[item.type_id].icon"></i>
                    </span>
                <span>{{ item.type_name }}</span>
                </div>
                <div class="percent">
                    {{ Number((item.number / Number(totalType == 'expense' ? total_expense : total_income))*100).toFixed(2) }}%
                </div>
                <div class="progress">
                     <van-progress  
                        :show-pivot="false"
                        track-color="white"
                        stroke-width="6px"
                        :percentage="Number((item.number / Number(totalType == 'expense' ? total_expense : total_income))*100)" />
                </div>
                <div class="money">¥{{ Number(item.number).toFixed(2) || 0 }}</div>
            </div>
        </div>
        <div class="chart">
            <div class="head">
                <span class="title">收支构成</span>
                <div class="tab">
                    <span
                        @click="changePieType('expense')"
                        class="expense"
                        :class="{ active: pieType == 'expense' }"
                    >
                        支出
                    </span>
                    <span
                        @click="changePieType('income')"
                        class="income"
                        :class="{ active: pieType == 'income' }"
                    >
                        收入
                    </span>
                </div>
            </div>
            <div id="chart"></div>
        </div>
    </div>
</template>

<script lang="ts" name="Data" setup>
 import * as echarts from 'echarts'
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'
import DateSelect from '../components/DateSelect.vue'
import {typeMap} from '../utils/index'

let dateSelect = ref('')//当前选择的日期
let dateVisible = ref(false)//日期选择操作面板
let total_expense = ref('')//总支出
let total_income = ref('')//总收入
let totalType = ref('expense')//进度条 类型
let pieType = ref('expense')//饼图 类型
let expense_data = reactive([])
let income_data = reactive([])
onMounted(()=>{
    onLoad()
})
// 初始日期
function currentDate(val:string){
   dateSelect.value = val
}
// 日期选择
function selectMonth(val:string){
   if(val){
        dateSelect.value = val
        onLoad()
   }
   dateVisible.value = false
}
// 加载数据
async function onLoad(){
    const {data} = await axios.get(`/bill/data?date=${dateSelect.value}`)
    total_expense.value = data.total_expense
    total_income.value = data.total_income
    expense_data = data.total_data.filter(item => item.pay_type == 1).sort((a, b) => b.number - a.number) // 过滤出账单类型为支出的项
    income_data = data.total_data.filter(item => item.pay_type == 2).sort((a, b) => b.number - a.number) // 过滤出账单类型为收入的项
    setPieChart()       
}
// 进度条类型选择
function changeTotalType(type:string){
    totalType.value = type
}
//饼图类型选择
function changePieType(type:string){
    pieType.value = type
    setPieChart()
}
// 绘制饼图
function setPieChart(){
    const proportionChart = echarts.init(document.getElementById('chart'));
        // 根据 pieType 变量判断是支出还是收入
        const data = pieType.value == 'expense' ? expense_data: income_data 
        // 添加图表配置数据
        proportionChart.setOption({
            tooltip: {//悬停时显示每个饼图切片的信息。
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            // 图例
            legend: {
                data: data.map(item => item.type_name)
            },
            series: [
              {
                name: '支出',
                type: 'pie', // 图标类型
                radius: '50%',
                // 饼图数据
                data: data.map(item => {
                  return {
                    value: item.number,
                    name: item.type_name
                  }
                }),
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
        })
}
</script>

<style scoped lang="scss">
.data{  
    min-height: 100%;
    background-color: $primary-bg;  
    .header{
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        padding: 20px 0;
        margin-bottom: 10px;
        .time{
            position: relative;
            padding: 5px;
            border-radius: 4px;
            margin-bottom: 10px;
            background-color: $primary-bg;
            .time-text{
                margin-right: 15px;
                font-size: 14px;
            }
            .time-text::after{
                content: '';
                position: absolute;
                top: 9px;
                bottom: 11px;
                left: 65px;
                width: 1px;
                background-color: black;
            }
            i{
                font-size: 19px;
            }
        }
        .title{
            color: $primary;
            margin-bottom: 5px;

        }
        .expense{
            color: $primary;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;

        }
        .income{
            color: rgba(0, 0, 0, 0.5);
            font-weight: 500;
        }
    }
    .structure {
        background-color: white;
        padding:0 15px;
        margin-bottom: 10px;
        .head{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            .title{
                font-size: 18px;
            }
            .tab {
                span {
                    display: inline-block;
                    width: 40px;
                    height: 24px;
                    background-color: #f5f5f5;
                    text-align: center;
                    line-height: 24px;
                    margin-left: 10px;
                    border-radius: 4px;
                }
                .expense {
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
        }
        .item{
            display: flex;
            align-items: center;
            padding-bottom: 18px;
            .item-icon{
                display: flex;
                align-items: center;
                .iconfont-wrap {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #f5f5f5;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    margin-right: 5px;
                }
                .expense {
                    background-color: $primary;
                    color: #fff;
                }
                .income {
                    background-color: $text-warning;
                    color: #fff;
                }
            }
            .percent{
                margin: 0 5px;
            }
            .progress{
                width: 170px;
            }
        }
        
    }
    .chart{
        background-color: white;
        padding:0 15px;
        .head{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            .title{
                font-size: 18px;
            }
            .tab {
                span {
                    display: inline-block;
                    width: 40px;
                    height: 24px;
                    background-color: #f5f5f5;
                    text-align: center;
                    line-height: 24px;
                    margin-left: 10px;
                    border-radius: 4px;
                }
                .expense {
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
        }
        #chart{
            width: 100%;
            height: 400px;

        }
    }

}
</style>