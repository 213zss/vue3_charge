<template>
      <van-cell-group class="item">
          <div class="header-date">
              <div>{{list.date}}</div>
              <div class="money">
              <span><b>支</b>{{ expense.toFixed(2)  }}</span>
              <span><b>收</b>{{ income.toFixed(2)  }}</span>
              </div>
          </div>
          <van-cell
              v-for="item in list.bills" :key="item.id"
              :class="{ expense: item.pay_type == 1, income: item.pay_type == 2 }"
              :title="item.type_name"
              :value="`${item.pay_type==1?'-':'+'}${item.amount}`"
              :label="`${formatTimestampToTime(item.date)} | ${item.remark}`"
              @click="goTo(item)"
          />
        </van-cell-group>
</template>

<script lang="ts" name="" setup>
import { defineProps,ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
function goTo(item:object){
  router.push({
    path: '/detail',
      query: {
        id: item.id
      }
  })
}

let expense = ref(0)
let income = ref(0)

const {list} = defineProps(['list'])


//时间戳格式化为时:分
function formatTimestampToTime(timestamp:string) {
  // 创建一个 Date 对象，传入时间戳作为参数
  const date = new Date(parseInt(timestamp));
  // 获取时、分
  const hours = date.getHours();
  const minutes = date.getMinutes();
  // 将时、分格式化为两位数的字符串
  const formattedHours = ('0' + hours).slice(-2);
  const formattedMinutes = ('0' + minutes).slice(-2); 
  // 返回格式化后的时分字符串
  return `${formattedHours}:${formattedMinutes}`;
}

expense.value = list.bills.filter(i => i.pay_type == 1).reduce((curr, item) => {
  curr += Number(item.amount)
  return curr
}, 0)
income.value = list.bills.filter(i => i.pay_type == 2).reduce((curr, item) => {
  curr += Number(item.amount)
  return curr
}, 0)


</script>

<style scoped lang="scss">
.item {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    .header-date {
      height: 60px;
      display: flex;
      background-color: #f9f9f9;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      .money {
        span {
          margin-left: 20px;
          b {
            background-color: $primary-bg;
            padding: 3px;
            margin-right: 2px;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .expense {
    .van-cell__title {
      text-align: left;
    }
    .van-cell__value {
      color: black!important;
    }
  }
  .income {
    .van-cell__title {
      text-align: left;
    }
    .van-cell__value {
      color: $text-warning!important;
    }
  }
</style>