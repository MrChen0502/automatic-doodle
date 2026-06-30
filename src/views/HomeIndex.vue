<template>
    <div class="homeindex">
        <el-card>
            <!-- 首页卡片组件 -->
        <HomeIndexCard />
        <!-- 分类组件 -->
        <HomeIndexNav />
        <!-- 图标组件+店铺提示+商品提示 -->
        <el-row :gutter="20">
            <!-- Echars图标组件 -->
            <el-col :span="12">
                <HomeIndexEcharts />
            </el-col>
            <el-col :span="12">
                <HomeIndexGoodsState gTitle="商品提示" gDesc="所有商品状态" :gData="goodsData"/>
                <HomeIndexGoodsState gTitle="订单提示提示" gDesc="所有订单状态" :gData="orderData"/>
            </el-col>
        </el-row>
        </el-card>
        
    </div>
</template>

<script setup>
// 导入子组件
import HomeIndexCard from '@/components/HomeIndexCard.vue';
import HomeIndexNav from '@/components/HomeIndexNav.vue';
import HomeIndexEcharts from '@/components/HomeIndexEcharts.vue';
import HomeIndexGoodsState from '@/components/HomeIndexGoodsState.vue';

// 导入请求店铺订单数据接口
import { getGoodsState } from '@/api/home';
import { ref } from 'vue';

// 初始化两个组件需要传递的数据
let goodsData = ref([])
let orderData = ref([])

// 直接调用请求函数并采用promise链式操作获取结果
getGoodsState().then( result => {
    if( result.msg != 'ok' || !result.msg ){
        return
    }
    // 赋值数据
    goodsData.value = result.data.goods;
    orderData.value = result.data.order;
} ).catch( error =>{
    console.log( new Error(error) );
} )
</script>

<style scoped>
.homeindex {
    height: 630px;

    .el-card {
        margin-top: 15px;
        height: calc(98vh -  120px);
    }
}
</style>