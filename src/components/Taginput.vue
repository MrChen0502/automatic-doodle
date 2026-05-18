<template>
    <div class="taginput">
        <!-- tag标签 -->
        <el-tag v-for="item in dynameTage" :key="item" closable @close="handCLoseTag(item)">
            {{ item }}
        </el-tag>
        <!-- 输入框 + 按钮：实现添加tag标签 ；设置一个判断条件如果满足条件显示输入框，否则日常显示按钮 -->
        <el-input v-if="isInput" v-model="InputValue" size="small" ref="InputRef" @blur="InputBlur" @keyup.enter="InputBlur"/>
        <el-button v-else size="small" @click="showInput">+ 添加规格</el-button>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

let isInput = ref(false);               //控制按钮或者输入框的显示隐藏
let InputValue = ref('');               //获取输入框的value值
let InputRef = ref(null);               //获取输入框的DOM元素对象


// 接收父组件传递过来的v-model数据
const props = defineProps({
    modelValue: String,        //v-model指令传递过来的数据
})

// 自定义事件
const emits = defineEmits(['update:modelValue'])

// 将父组件传递过来的数据转换成数组
const dynameTage = ref(props.modelValue ? props.modelValue.split(',') : [])
console.log(dynameTage);

/*********************************************************************************************************** */

// 初始化关闭选中标签函数
const handCLoseTag = (val) => {
    // 查找当前元素在数组中的位置
    // let index = dynameTage.value.indexOf(val);
    // 根据查询到的位置，在数组中移除元素
    // dynameTage.value.splice(index, 1)
    dynameTage.value.splice(dynameTage.value.indexOf(val), 1)

    // 将数组重新转换为字符串,并通过自定义事件将新数组返回给父组件
    emits('update:modelValue', dynameTage.value.join(','))
}

// 初始化关闭某个tag标签函数——本质上解释执行移除数组中的指定元素
const showInput = () => {
    isInput.value = true;
    nextTick(() => {
        InputRef.value?.focus()  // 输入框出现后自动聚焦
    })
}

// 初始化输入框失去焦点事件：1.如果输入框有内容执行添加操作；2.告知父组件；3.重新切换成按钮状态
const InputBlur = () => {
    if (InputValue.value != '') {
        dynameTage.value.push(InputValue.value)
        emits('update:modelValue' , dynameTage.value.join(','))
    }
    isInput.value = false;
    InputValue.value = '';
}
</script>

<style scoped>
.taginput {

    .el-tag {
        margin-right: 5px;
    }
}
</style>