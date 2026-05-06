<template>
    <div class="updaterole">
        <el-dialog v-model="isDialog" :title="propTitle" width="40%" @close="CloseDialog">

        </el-dialog>
    </div>
</template>
<script setup>
import { reactive, ref , watch } from 'vue';


/************************************************************ */
let isDialog = ref(false);          //对话框的显示隐藏
// 表单数据源对象
let formDataModel = reactive({
    name : '',
    desc : '',
    status : 1,
})
let formDom = ref('');              //表单DOM元素
// 表单验证规则
let formRules = reactive({
    name : [{required : true , message : '角色名称不允许为空！！！' , trigger : 'blur'}],
    desc : [{required : true , message : '角色描述不允许为空！！！' , trigger : 'blur'}],
    status : [{required : true , message : '角色状态不允许为空！！！' , trigger : 'blur'}]
})

// 接收父组件传递过来的数据
const props = defineProps({
    propTitle : String,
})

// 子组件自定义绑定事件数据
const emits = defineEmits(['update:propTitle']);
/************************************************************ */
// 启动监听器，监听传递过来的对话框标题propTitle
watch( ()=>props.propTitle , (newVal) =>{
    OpenDialog();
})

// 初始化打开对话框
const OpenDialog = ()=>{
    isDialog.value = true
}

// 初始化关闭对话框
const CloseDialog = ()=>{
    // 告知父组件对话框标题清空
    emits('update:propTitle' , null)
    isDialog.value = false
}
</script>

<style scoped></style>