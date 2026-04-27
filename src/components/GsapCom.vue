<template>
    <div>
        {{ data.num.toFixed(2) }}
    </div>
</template>

<script setup>
// 导入插件
import gsap from 'gsap';
import { watch } from 'less';
import { reactive } from 'vue';

// 初始化数据
let data = reactive({
    num: 0
})

// 选项式API的props属性 在setup语法糖内改为 由defineProp() 组合式API
// 由defineProp函数负责接收子组件的数据[并且设置数据类型以及默认值]
const props = defineProps({
    // 定义负责接收父组件数据的prop数据
    propval: {
        type: Number,
        dafault: 0,  //起点数字 
    },
    // ......
})

// 定义方法使用插件的动画效果
function AnimateFn() {
    // 调用gasp的to动画终点函数
    gsap.to(data, {
        // 配置 : 0.5毫秒之间将从0转换到传递过来的数据
        duration: 0.5,
        num: props.propval, //终点数字
    })
}
AnimateFn();

// 实际商城会在每一分钟都有可能新增订单或者销售额等数据，如果想要数字滚动状态保持，需要将父组件的数据进行监听：只要父组件的数据以改变都将执行滚动数字动画
/*
以下写法适合监听函数返回值的变量
watch( ()=>返回被监听的复合型数据 , ()=>返回监听更新数据时执行的操作 )
*/
// watch( ()=>props.propval , ()=>AnimateFn )
</script>
