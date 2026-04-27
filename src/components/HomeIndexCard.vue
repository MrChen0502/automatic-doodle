<template>
    <el-row :gutter="20">
        <!-- 骨架屏判断 -->
        <template v-if="panelsData.length == 0">
            <el-col :span="6" v-for="i in 4" :key="i">
                <!-- 骨架屏占位 -->
                <el-skeleton animated loading style="width: 100%;">
                    <template #template>
                        <!-- 卡片 -->
                        <el-card shadow="hover">
                            <!-- 卡片头部 -->
                            <div class="t_title"><el-skeleton-item variant="text" style="width: 40%;" /></div>
                            <!-- 卡片主体 -->
                            <div class="t_main"><el-skeleton-item variant="text" style="width: 80%;" /></div>
                            <!-- 卡片尾部 -->
                            <div class="t_footer"><el-skeleton-item variant="text" style="width: 40%; margin-top: 10px;" /></div>
                        </el-card>
                    </template>
                </el-skeleton>
            </el-col>
        </template>
        <!-- <el-col :span="6" v-for="item in panelsData" :key="item"> -->
        <!-- 如果统计数据超过4条会影响排版，需要限制只能显示4条数据 -->
        <el-col :span="6" v-for="item in panelsData" :key="item">
            <!-- 卡片 -->
            <el-card shadow="hover">
                <!-- 卡片头部 -->
                <div class="t_title">
                    <span>{{ item.title }}</span>
                    <el-tag type="primary">{{ item.unit }}</el-tag>
                </div>
                <!-- 卡片主体 -->
                <div class="t_main">
                    <GsapCom :propval="item.value" />
                </div>
                <!-- 卡片尾部 -->
                <div class="t_footer">
                    <span>{{ item.subTitle }}</span>
                    <el-tag type="primary">{{ item.subValue }}</el-tag>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup>
// 导入接口函数
import { getOrderState } from '@/api/home';
import { ref } from 'vue';

// 导入子组件
import GsapCom from '@/components/GsapCom.vue'

// 初始化变量
let panelsData = ref([])

// 调用请求函数
getOrderState().then(res => {
    // 判断提取数据
    if (res.msg == 'ok' || res.data) {
        panelsData.value = res.data.panels
    }
    console.log(res);
}).catch(err => {
    console.log(new Error(err));
})
</script>

<style scoped lang="less">
.el-row {
    margin-top: 20px;

    .t_title {
        display: flex;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        border-bottom: 14px;
        border-bottom: 1px solid #dbdbdb;
        padding-bottom: 5px;

        .el-tag {
            margin-left: auto;
        }
    }

    .t_main {
        font-size: 28px;
        line-height: 100px;
        /** 块级标签没有高度只有行高也可以当做垂直居中处理 */
        font-weight: 800;
        text-align: center;
        border-bottom: 1px solid #dbdbdb;
    }

    .t_footer {
        display: flex;
        height: 30px;
        line-height: 30px;
        font-size: 14px;

        span:nth-child(2) {
            padding-left: 15px;
        }

        .el-tag {
            margin-left: 20px;
            margin-top: 4px;
        }
    }
}
</style>