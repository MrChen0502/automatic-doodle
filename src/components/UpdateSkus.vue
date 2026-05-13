<template>
    <el-dialog v-model="isDialog" :title="propTitle" destroy-on-close @close="CloseDialog">
        <!-- destroy-on-close属性：关闭对话框时移除/删除对话框所有标签结构 -->
        <el-form ref="SkusFromRef" :model="SkusFromRef" :rueles="SkusFromRules" label-width="120px">
            <el-form-item label="规格名称" prop="name">
                <el-input v-model="SkusFromModel.name"></el-input>
            </el-form-item>
            <el-form-item label="规格数据" prop="default">
                <el-input v-model="SkusFromModel.default"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="SkusFromModel.order" :min="1" :max="1000" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-switch v-model="SkusFromModel.status" :active-value="1" :inactive-value="0" inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
            </el-form-item>
            <template #footer>
                <span class="dialog-footer">
                    <el-button plain>确定</el-button>
                </span>
            </template>
        </el-form>
    </el-dialog>
</template>

<script setup>
import { ref, watch, reactive } from 'vue';
/********************************************************************* */
let isDialog = ref(false);      //对话框控制变量
let SkusFromRef = ref(null);    //表单DOM元素
// 表单数据对象   
let SkusFromModel = reactive({
    name: '',
    default: '',
    order: 1,
    status: 1
})

// 表单验证规则
const SkusFromRules = reactive({
    name: [{ required: true, message: '商品规格名称不得为空！', trigger: 'blur' }],
    default: [{ required: true, message: '规格数据不得为空！', trigger: 'blur' }]
})

// 接收父组件传递过来的数据
const props = defineProps({
    propTitle: String,
    propsItem: Object,
})
// 自定义事件操作
const emits = defineEmits(['update:propTitle'])
/********************************************************************* */
// 启动监听器:监听对话框标题变量：如果为空执行关闭对话框操作，如果有值执行打开操作
watch(() => props.propTitle, (newVal) => {
    newVal != '' ? Opdialog() : CloseDialog();
})
// 打开对话框函数
const Opdialog = () => {
    isDialog.value = true;
    // 判断：添加时清空上一次表单数据：编辑时将传过来的数据显示在表单上
    switch (props.propTitle) {
        case '新增规格':
        SkusFromModel.name = '';
        SkusFromModel.default = '';
        SkusFromModel.order = 1;
        SkusFromModel.status = 1;

            break;
        case '编辑规格':
        SkusFromModel.name = props.propsItem.name;
        SkusFromModel.default = props.propsItem.default;
        SkusFromModel.order = props.propsItem.order;
        SkusFromModel.status = props.propsItem.status;
            break;
    }
}

const CloseDialog = () => {
    isDialog.value = false;
    // 清除对话框标题
    emits('update:propTitle', '')
}






</script>

<style></style>