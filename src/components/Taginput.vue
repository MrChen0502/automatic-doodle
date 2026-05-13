<template>
    <div class="taginput">
        <!-- tag标签 -->
         
    </div>
</template>

<script setup>
// 接收父组件传递过来的v-model数据
const props = defineProps({
    modelValue : String ,        //v-model指令传递过来的数据
})

// 自定义事件
const emits = defineEmits(['update:modelValue'])
</script>

<style scoped>

</style>