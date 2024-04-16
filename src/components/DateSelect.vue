<template>
    <van-action-sheet v-model:show="show">
        <van-date-picker
            v-model="currentDate"
            title="选择年月"
            :min-date="minDate"
            :max-date="maxDate"
            :formatter="formatter"
            :columns-type="columnsType"
            @confirm="confirmDate"
            @cancel="cancelDate"
        />
    </van-action-sheet>
</template>

<script lang="ts" name="DateSelect" setup>
// 日期选择
import { ref,computed, onBeforeMount,defineExpose } from 'vue'
import dayjs from 'dayjs'
const emit = defineEmits(['currentDate','selectMonth'])
let now = ref(dayjs().format('YYYY-MM'))//获取现在的时间，并格式化
const currentDate = ref(now.value.split('-'));
const columnsType = ['year', 'month'];
const minDate = new Date(2020, 0, 1)
const maxDate = new Date(2025, 5, 1)
let show = ref(false)
defineExpose({toggle})

onBeforeMount(()=>{
   emit('currentDate',listDate.value)
})

function toggle(){
   show.value = !show.value
}
// 格式化日期选项
function formatter(type:any, option:object) {
   if (type === 'year') {
      option.text += '年';
   }
   if (type === 'month'){
      option.text += '月';
   }
   return option;
}
// 确认修改日期
async function confirmDate(val:object){
   currentDate.value = val.selectedValues
   emit('selectMonth',listDate.value)
   show.value = false
}
// 取消修改日期
async function cancelDate(){
   show.value = false
}
// 时间格式化
const listDate = computed(() => currentDate.value.join('-'));
</script>
