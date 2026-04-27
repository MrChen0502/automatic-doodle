<template>
    <div class="homeindexecharts">
        <el-card>
            <h1 class="t_title">
                订单统计
                <span>
                    <el-check-tag v-for="item in TagList" :key="item.value" :checked="currentTag == item.value"
                        @change="editCurrent(item.value)">
                        {{ item.title }}
                    </el-check-tag>
                </span>
            </h1>
            <!-- 卡片主体：柱状图 -->
            <div class="t_main" ref="mainDom"></div>
        </el-card>
    </div>
</template>

<script setup>
import { ref , reactive } from 'vue';
//导入echarts接口的请求函数
import { getEchartsData } from '@/api/home'
//导入整个echarts模块并设置别名
import * as echarts from 'echarts'
//图表数据是在打开浏览器时就会显示，应用周期函数
import { onMounted, onBeforeUnmount } from 'vue'
//初始化实例变量
var myChart;

// 默认选中项
let currentTag = ref('week');

const mainDom = ref(null)
const TagList = reactive([
    { title: '月', value: 'month' },
    { title: '周', value: 'week' },
    { title: '天', value: 'hour' }
])

// check-Tag组件改变事件
const editCurrent = (val) => {
    currentTag.value = val;
    console.log("选中了:" + val);
}

//当组件的视图template渲染完成之后，将指定的标签作为图标容器，赋值给实例变量
onMounted(() => {
    if(mainDom.value){
        myChart = echarts.init(mainDom.value)
    }
    //调用绘制图表函数并请求数据
    MakeEcharts()
})
//初始化函数：请求图表数据+配置图表设置+绘制图表
const MakeEcharts = async () => {
    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar',
                //自定义背景样式
                showBackground: true,
                backgroundStyle: {
                    color: "rgba(180,180,180,0.2)"
                }
            }
        ]
    };
    //加载中：当图表还未绘制完成时显示的插件    容器名.showLoading()
    if(!myChart)return;
    myChart.showLoading();
    //请求数据
    let result = await getEchartsData(currentTag.value)
    if (result.msg != 'ok' || !result.data) {
        //请求反馈没有数据、数据过期、请求失败
        //终止程序
        return
    }
    myChart.hideLoading();
    //必须同时搭配适应结束函数，否则加载中的动画将不会停止myChart.hideloading();容器名.hideLoading()
    //向图表配置传递请求反馈的数据
    option.xAxis.data = result.data.x
    option.series[0].data = result.data.y
    //调用绘制图表的数
    myChart.setOption(option)
}

//页面关闭之前(释放缓存数据)，先销毁图表
onBeforeUnmount(() => {
    //为了避免数据泄露以及图表白屏，需要在页面关闭数据释放之前销毁图表
    if (myChart) {
        echarts.dispose(myChart)
    }
})
</script>

<style scoped lang="less">
.homeindexecharts {
    width: 100%;
    margin-top: 20px;

    .t_title {
        font-size: 14px;
        font-weight: normal;
        display: flex;
        line-height: 30px;
        border-bottom: 1px solid #dbdbdb;
        padding-bottom: 15px;

        span {
            margin-left: auto;

            .el-check-tag {
                margin-left: 10px;
            }
        }
    }

    .t_main {
        width: 100%;
        height: 330px;
    }
}
</style>