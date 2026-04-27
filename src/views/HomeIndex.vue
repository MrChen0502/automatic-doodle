<!-- <template>
    <div class="homeindex">
        <div class="homeindex-header">
            <el-card 
                v-for="item in $store.state.statistics.panels" 
                :key="item.title"
                style="max-width: 480px"
            >
                <template #header>
                    <div class="card-header">
                        <span>{{ item.title }}</span>
                        <span class="stat-unit">{{ item.unit }}</span>
                    </div>
                </template>
                <div class="stat-content">
                    <div class="stat-value">
                        {{ item.value }}
                    </div>
                    <div class="stat-sub">
                        {{ item.subTitle }}: {{ item.subValue }}{{ item.subUnit }}
                    </div>
                </div>
            </el-card>
        </div>
        
        <div class="homeindex-header-body">
            <el-card v-for="item in 8" :key="item">
                <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
            </el-card>
        </div>
        
        <div class="ss">
            <el-card class="chart-card">
                <template #header>
                    <div class="chart-header">
                        <span>订单趋势图</span>
                    </div>
                </template>
                <div id="main" style="width: 100%; height: 400px;"></div>
            </el-card>
        </div>
        
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { onMounted } from 'vue';
import * as echarts from 'echarts';

const store = useStore();

// 在组件挂载后初始化图表
onMounted(() => {
    // 获取 DOM 元素
    var chartDom = document.getElementById('main');
    
    // 检查元素是否存在
    if (chartDom) {
        // 初始化图表
        var myChart = echarts.init(chartDom);
        
        // 图表配置（带背景色）
        var option = {
            title: {
                text: '一周订单量统计',
                left: 'center',
                top: 10
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ["07-24",
			"07-23",
			"07-22",
			"07-21",
			"07-20",
			"07-19",
			"07-18"],
                axisLabel: {
                    fontSize: 12
                }
            },
            yAxis: {
                type: 'value',
                name: '订单量 (笔)'
            },
            series: [
                {
                    data: [51,
			0,
			1,
			1,
			0,
			2,
			1],
                    type: 'bar',
                    showBackground: true,  // 显示背景
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)',  // 背景色（浅灰色半透明）
                        borderRadius: [5, 5, 0, 0]  // 背景圆角
                    },
                    itemStyle: {
                        borderRadius: [5, 5, 0, 0],  // 柱状图圆角
                        color: '#409EFF'  // 柱状图颜色
                    },
                    label: {
                        show: true,
                        position: 'top',
                        color: '#333'
                    }
                }
            ]
        };
        
        // 设置图表选项
        myChart.setOption(option);
        
        // 响应窗口大小变化
        window.addEventListener('resize', () => {
            myChart.resize();
        });
    }
});
</script>

<style scoped>
.homeindex {
    width: 98%;
    height: 98%;
    margin-top: 5px;
    padding: 20px;
    overflow-y: scroll;  /* 内容溢出时显示滚动条 */
}

.homeindex-header {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 20px;
}

.homeindex-header-body {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 20px;
    margin-bottom: 20px;
}

/* ECharts 图表区域 */
.ss {
    margin-top: 20px;
}

.chart-card {
    width: 100%;
    border-radius: 8px;
}

.chart-header {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

/* 统计卡片样式 */
.stat-content {
    text-align: center;
    padding: 20px 0;
}

.stat-value {
    font-size: 32px;
    font-weight: bold;
    color: #409EFF;
    margin-top: -15px;
}

.stat-unit {
    font-size: 14px;
    border: 5px solid #bfdaf5;
    color: #85c1f3;
    float: right;
    border-radius: 4px;
    background-color: #bfdaf5;
}

.stat-sub {
    font-size: 14px;
    color: #666;
    border-top: 1px solid #f0f0f0;
    padding-top: 10px;
    margin-top: 10px;
}

.card-header {
    font-size: 16px;
    font-weight: bold;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}
</style> -->


<template>
    <div class="homeindex">
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
    overflow-x: hidden;
    overflow-y: auto;
}
</style>