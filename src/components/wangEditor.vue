<template>
    <div class='wang_editor_com'>
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            :mode="props.mode" />
        <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
            :mode="props.mode" @onCreated="handleCreated" />
    </div>
</template>

<script setup>
// 引入css
import '@wangeditor/editor/dist/css/style.css';
// 引入周期函数以及响应式函数
import { onBeforeUnmount, watch, ref, shallowRef } from 'vue';
// 导入插件的组件
import { Toolbar, Editor } from '@wangeditor/editor-for-vue';
// 编辑器实例化，使用shallowRef
const editorRef = shallowRef();
// 工具栏组件的默认配置
const toolbarConfig = {};
// 编辑器的默认配置
const editorConfig = {
    placeholder: '请输入内容'
}
// 接收父组件传递过来的数据
const props = defineProps({
    modelValue : String,
    mode : {
        type : String,
        default : 'default'
    }
})
// 自定义事件
const emits = defineEmits(['update:modelValue']);

let valueHtml = ref( props.modelValue );        //接收父组件传递过来的商品详情内容

/************************************************************************************** */
// 优化：当父子组件视图渲染完成但是没有数据发生传递，需要对传递的数据进行监听
watch(()=>props.modelValue , (newVal)=>{
    valueHtml.value = newVal;
})
// 为了实时将子组件第三方插件的数据传递返回给父组件的操作
watch(valueHtml , (newVal)=>{
    emits('update:modelValue' , newVal);
})
// 当前组件销毁之前：销毁整个编辑器插件视图与数据
onBeforeUnmount(()=>{
    if( editorRef.value == null ) return
    // 销毁编辑器
    editorRef.value.destroy();
})
// 编辑器完成编辑的创建过程函数
const handleCreated = ( editor )=>{
    // 记录editor实例的整个过程
    editorRef.value = editor;
}
</script>

<style scoped lang="less">
.wang_editor_com {   // 原来是 wang_deitor_com
  border: 1px solid #ccc;
}
</style>