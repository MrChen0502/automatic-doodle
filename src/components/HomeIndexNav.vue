<template>
    <el-row :gutter="20">
        <template v-if="menuList.length == 0">
            <el-col :span="3" v-for="i in 8" :key="i">
                <!-- 骨架屏占位 -->
                <el-skeleton animated loading style="width: 100%;">
                    <template #template>
                        <!-- 卡片 -->
                        <el-card shadow="hover">
                            <!-- 卡片图标 -->
                            <div class="t_main"><el-skeleton-item variant="text" style="width: 80%;" /></div>
                            <!-- 卡片文字 -->
                            <div class="t_main"><el-skeleton-item variant="text" style="width: 80%;" /></div>
                        </el-card>
                    </template>
                </el-skeleton>
            </el-col>
        </template>

        <el-col :span="3" v-for="item in menuList" :key="item">
            <!-- 卡片 -->
            <el-card shadow="hover">
                <!-- 卡片图标 -->
                <div class="t_title">
                    <el-icon :size="24" :color="item.color">
                        <component :is="item.icon" />
                    </el-icon>
                </div>
                <!-- 卡片文字 -->
                <div class="t_main">
                    {{ item.title }}
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup>
import { reactive } from 'vue';

// 定义一个响应式常量，存放菜单数据
const menuList = reactive([
    {
        icon: "Picture",
        title: "图库管理",
        path: "/image/list"
    },
    {
        icon: "User",
        title: "管理员管理",
        path: "/manager/list"
    },
    {
        icon: "Shopping-Cart",
        title: "商品管理",
        path: "/goods/list"
    },
    {
        icon: "Tickets",
        title: "订单管理",
        path: "/order/list"
    },
    {
        icon: "Star",
        title: "评价管理",
        path: "/comment/list"
    },
    {
        icon: "Edit",
        color: "text-green-500", // 这个颜色类可以在渲染时使用
        title: "公告管理",
        path: "/notice/list"
    },
    {
        icon: "Present",
        title: "优惠券管理",
        path: "/coupon/list"
    },
    {
        icon: "Setting",
        title: "分销设置",
        path: "/setting/base"
    },
])
</script>

<style scoped>
.el-col {
    margin-top: 10px;
    cursor: pointer;
    .t_title{
        display: flex;
        justify-content: center;
    }

    .el-card {
        align-items: center;
    }
}
</style>