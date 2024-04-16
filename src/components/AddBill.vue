<template>
      <van-action-sheet :closeable="true" v-model:show="show">
         <div class="top">
            <span class="close" @click="toggle">
               <van-icon name="cross" />
            </span>
            <van-button 
               class="add-btn" 
               type="primary" 
               size="small"
               @click="add">
               确定
            </van-button>
         </div>
         <div class="type-time">
            <div class="type">
               <span
                  @click="changeType('expense')"
                  :class="{ expense: true, active: payType == 'expense' }"
                  >支出</span>
                  <span
                  @click="changeType('income')"
                  :class="{ income: true, active: payType == 'income' }"
                  >收入</span>         
            </div>
            <div @click="dayVisible = true" class="time">
               {{itemDate}}
            </div>
            <van-action-sheet v-model:show="dayVisible">
               <van-date-picker
                  v-model="chargeDate"
                  title="选择时间"
                  :min-date="minDate"
                  :max-date="maxDate"
                  @confirm="confirmChargeDate"
                  @cancel="cancelChargeDate"
                  />
            </van-action-sheet>
         
         </div>
         <div class="money">
            <span>￥</span>
            <van-field v-model="price" readonly/>
         </div> 
         <div class="type-icon">
            <div class="type-body" v-if="payType == 'expense'">
               <div
                  class="type-item"
                  v-for="item in expense"
                  :key="item.id"
                  @click="choseTypeItem(item)"
                  >
                  <span
                     :class="{'iconfont-wrap': true,expense:true, active: currentType.id == item.id}"
                  >
                     <i class="iconfont" :class="typeMap[item.id].icon"></i>
                  </span>
                  <span>{{ item.name }}</span>
               </div>
            </div>
            <div class="type-body" v-else>
               <div
                  class="type-item"
                  v-for="item in income"
                  :key="item.id"
                  @click="choseTypeItem(item)"
                  >
                  <span 
                     :class="{'iconfont-wrap': true,income:true, active: currentType.id == item.id}"
                  >
                     <i class="iconfont" :class="typeMap[item.id].icon"></i>
                  </span>
                  <span>{{ item.name }}</span>
               </div>
            </div>
         </div>
         <div class="remark" v-if="remark" @click="remarkVisible = true">
            {{ remark }}
         </div>
         <div class="remark" v-else @click="remarkVisible = true">添加备注</div>
         <van-dialog 
            v-model:show="remarkVisible" 
            title="备注" 
            show-cancel-button
            >
            <van-cell-group inset>
               <van-field
                  v-model="remark"
                  rows="2"
                  autosize
                  type="textarea"
                  maxlength="10"
                  placeholder="请输入备注"
                  show-word-limit
               />
            </van-cell-group>
         </van-dialog>
         <van-number-keyboard
            v-model="price"
            :show="boardVisible"
            :extra-key="['.']"
            />
      </van-action-sheet>
</template>

<script lang="ts" name="AddBill" setup>
   import {defineExpose,reactive,ref,computed, onMounted} from 'vue'
   import { typeMap } from '../utils/index'
   import { showSuccessToast,showFailToast} from 'vant';
   import axios from 'axios';

   let dayVisible = ref(false)//账单时间弹窗
   let now = new Date()//当前时间
   let year = now.getFullYear();//当前时间的年份
   let month = ('0' + (now.getMonth() + 1)).slice(-2); // 添加前导零
   let day = ('0' + now.getDate()).slice(-2); // 添加前导零
   const minDate= new Date(2020, 0, 1)
   const maxDate= new Date(2025, 5, 1)
   let chargeDate=ref([year,month,day])//账单时间
   let payType=ref('expense')//支出？收入
   let expense=reactive([])//支出类型集合
   let income=reactive([])//收入类型集合
   let currentType=ref({})//支出？收入具体类型对象
   let remarkVisible=ref(false)//添加备注信息弹窗
   let boardVisible = ref(true)//数字键盘弹窗
   let price=ref('')//价格
   let remark=ref('')//备注
   let show=ref(false)//添加账单的显示和隐藏

   const emit= defineEmits(['refresh'])
   defineExpose({toggle})
   const {detail} = defineProps({
      detail:{
         type: Object,
         default: {}
         }
      }
   );

   onMounted(()=>{
      loadData()
   })

   function toggle(){
      show.value=!show.value 
      if(detail.id){
         const date =new Date(detail.date)
         const year = date.getFullYear();
         const month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从0开始，所以要加1
         const day = ('0' + (date.getDate()  )).slice(-2);
         chargeDate.value=[year,month,day];
         payType.value=detail.pay_type==1?'expense':'income'
         price.value=detail.amount
         remark.value=detail.remark
         currentType.value.id=detail.type_id     
         currentType.value.name=detail.type_name    
      }
      else{
         currentType.value = expense[0]   
      }    
   }
   //加载数据
   async function loadData(){
      const {
         data: { list },
         } = await axios.get("/type/list");
         // i.type = 1 的为支出的标签类型
         expense = list.filter((i) => i.type == 1);
         // i.type = 2 的为收入的标签类型
         income = list.filter((i) => i.type == 2);
   }
   // 将整数价钱格式化成.00形式
   function formatToTwoDecimalPlaces(value:string){ 
      // 如果是整数
      if(!value.includes('.')){
         return value + '.00';
      }
      // 如果是小数，则保持不变
      else {
         return value;
      }
   }
   //确认账单时间
   function confirmChargeDate(val:object){
      chargeDate.value=val.selectedValues;
      dayVisible.value=false
   }
   //取消账单时间
   function cancelChargeDate(){
      dayVisible.value=false
   }
   // 选择支出?收入
   function changeType(val:string){
      payType.value=val
      if(val=='expense') {
         currentType.value=expense[0]
         console.log(expense[0]);    
      }
      else{
         currentType.value=income[0]
      }  
   }
   //选择具体支出收入类型
   function choseTypeItem(val:object){
      currentType.value=val
   }
   //添加账单
   async function add(){
         if (!price.value) {
            showFailToast ('请输入具体金额')
               return
         }
         const params = {
            date:Date.parse(chargeDate.value),
            pay_type:payType.value=='expense'?1:2,
            amount:formatToTwoDecimalPlaces(price.value),
            remark:remark.value,
            type_id:currentType.value.id,
            type_name:currentType.value.name
         }
         console.log(params);
         
         if(!detail.id){
            const {code}=await axios.post('/bill/add',params)
            if(code==200){
               showSuccessToast('添加成功');
               show.value=false
               now = new Date()
               payType.value='expense'
               price.value = ''
               remark.value=''
               currentType.value=expense[0]
            }
         }
         else{
               params.id = detail.id
               const result = await axios.post('/bill/update', params)
               show.value = false
               showSuccessToast('修改成功');
               emit('refresh')
         }
   
   }
   // 时间格式化
   const itemDate = computed(() => chargeDate.value[1]+'-'+chargeDate.value[2]);

</script>

<style scoped lang = "scss">

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

</style>