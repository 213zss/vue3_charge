<template>
    <div class="about">
        <!-- 顶部导航栏 -->
        <van-nav-bar
            title="关于我们"
            left-text="返回"
            left-arrow
            @click-left="back"
            :fixed="true"
            />
        <!-- 关于我们内容 -->
        <h1>关于我们</h1>
        <div class="content">
            欢迎使用我们的记账应用！我们是一支致力于为用户提供方便、简单、高效的记账解决方案的团队。
            我们相信良好的财务习惯对每个人都至关重要，因此我们设计并开发了这个应用，
            帮助您轻松管理个人财务，实现理财目标。
        </div>
        <h1>联系我们</h1>
        <div class="content"> 
            <p>如果您有任何问题、建议或反馈，都可以随时联系我们。您可以通过以下方式与我们联系：</p>
            <p>电子邮件：contact@example.com</p>
            <p>客服电话：+1234567890</p>
            <p>社交媒体：Twitter | Facebook</p>
        </div>
        <div class="bottom">
            感谢您选择我们的记账应用，我们期待为您提供最佳的记账体验！
        </div>
    </div>
</template>

<script lang="ts" name="About" setup>
import {useRouter} from 'vue-router'
const router = useRouter();
//返回上一级
function back(){
    router.back();
}
</script>

<style scoped lang="scss">
.about{
    height: calc(100% - 16px);
    position: relative;
    padding: 80px 20px 0 20px;
    h1{
        margin: 15px 0  ;
    }
    .content{
        font-size: 14px;
        color: rgba(0, 0, 0, 0.5);
        line-height: 24px;
    }
    .bottom{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0; /* 设置 left 和 right 为 0 */
        text-align: center; /* 文本水平居中对齐 */
        font-size: 12px;
        margin: 0 auto;
    }
}
</style>