<template>
    <div class="img-verify">
        <canvas 
            ref="verify" 
            :width="width" 
            :height="height"
            @click="change"></canvas>
    </div>
</template>

<script lang="ts" name="" setup>
import { onMounted, ref ,defineExpose} from 'vue'
let verify=ref(null)
let width=ref(120)
let height=ref(40)
let pool=ref('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890') // 字符串
let imgCode=ref('')
defineExpose({imgCode})
onMounted(()=>{
    draw() 
})

// 点击切换验证码
function change(){
    draw()  
}
// 生成随机数
function randomNum(min, max){
    return parseInt(Math.random() * (max - min) + min)
}
// 生成随机颜色
function randomColor(min, max){
    const r = randomNum(min, max)
    const g = randomNum(min, max)
    const b = randomNum(min, max)
    return `rgb(${r},${g},${b})`
}
function draw(){   
    randomColor(180, 230)
    // 获得 2d 上下文对象
    const ctx = verify.value.getContext('2d')
    // // 填充颜色
    ctx.fillStyle = randomColor(200, 250)
    // 填充的位置
    ctx.fillRect(0, 0, width.value, height.value)
    // 随机产生字符串，并且随机旋转
    for(let i=0;i<4;i++){
        // 随机的四个字
        const text=pool.value[randomNum(0,pool.value.length)]
        imgCode.value+=text
         // 随机的字体大小
        const fontSize = randomNum(18, 40)
          // 字体随机的旋转角度
        const deg = randomNum(-30, 30)

        /*
        * 绘制文字并让四个文字在不同的位置显示的思路 :
        * 1、定义字体
        * 2、定义对齐方式
        * 3、填充不同的颜色
        * 4、保存当前的状态（以防止以上的状态受影响）
        * 5、平移translate()
        * 6、旋转 rotate()
        * 7、填充文字
        * 8、restore出栈
        * */
        // 字体
        ctx.font = fontSize + 'px Arial'
        
        ctx.textBaseline = 'top'
        ctx.fillStyle = randomColor(10, 200)
        /*
        * save() 方法把当前状态的一份拷贝压入到一个保存图像状态的栈中。
        * 这就允许您临时地改变图像状态，
        * 然后，通过调用 restore() 来恢复以前的值。
        * save是入栈，restore是出栈。
        * 用来保存Canvas的状态。save之后，可以调用Canvas的平移、放缩、旋转、错切、裁剪等操作。 restore：用来恢复Canvas之前保存的状态。防止save后对Canvas执行的操作对后续的绘制有影响。
        *
        * */
        ctx.save()
        ctx.translate(30 * i + 15, 15)
        ctx.rotate((deg * Math.PI) / 180)
        // fillText() 方法在画布上绘制填色的文本。文本的默认颜色是黑色。
        // 请使用 font 属性来定义字体和字号，并使用 fillStyle 属性以另一种颜色/渐变来渲染文本。
        // context.fillText(text,x,y,maxWidth);
        ctx.fillText(text, -10, -15)
        ctx.restore()
    }
    // 随机产生5条干扰线
    for (let i = 0; i < 5; i++) {
        ctx.beginPath(); //新建一条path
        ctx.moveTo(randomNum(0, width.value), randomNum(0, height.value))//把画笔移动到指定的坐标
        ctx.lineTo(randomNum(0, width.value), randomNum(0, height.value))//绘制一条从当前位置到指定坐标的直线.
        ctx.strokeStyle = randomColor(180, 230)
        //闭合路径。会拉一条从当前点到起始点的直线。如果当前点与起始点重合，则什么都不做
        ctx.closePath();
        ctx.stroke(); //绘制路径。  
    }
}
</script>

<style scoped>
.img-verify{
    cursor: pointer;
}
</style>