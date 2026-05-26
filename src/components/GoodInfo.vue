<template>
    <div class="goodinfo">
        <el-dialog v-model="isDialog" title="设置商品详情" width="50%" destory="on-close" @close="CloseDialog">
            <el-form :model="FormModel">
                <el-form-item label="编辑商品详情">
                    <!-- 子组件 -->
                    <wangEditor v-model="FormModel.content" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="CloseDialog">取消</el-button>
                    <el-button style="background-color: #1AA094;color: white; " @click="setGoodInfofn">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { watch, ref, reactive } from 'vue';
import { getGoodsMessageFn, setGoodContentFn } from '../api/goods';
import { ElMessage } from 'element-plus';
import wangEditor from './wangEditor.vue';

let isDialog = ref(false);
const FormModel = reactive({
    content: '',
})

const props = defineProps({
    propId: Number
})
const emits = defineEmits(['update:propId']);

/************************************************************************************* */
watch(() => props.propId, (newVal) => {
    newVal == '' ? CloseDialog() : OpenDialog();
})

// 初始化设置商品详情函数
const setGoodInfofn = async () => {
    let result = await setGoodContentFn(props.propId, FormModel);
    console.log(result);

    isDialog.value = true;

    if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg);

    CloseDialog();
}

// 初始化启动弹窗
const OpenDialog = async () => {
    isDialog.value = true;

    // 根据商品ID获取商品详情
    let result = await getGoodsMessageFn(props.propId);

        // ✅ 打印结果，查看实际数据结构
       console.log('完整 result:', result);
    console.log('result.data:', result.data);

    if (result.msg != 'ok' || !result.data) {
        isDialog.value = false;
        return ElMessage.error(result.msg);
    }


    FormModel.content = result.data.content;
}

// 初始化关闭对话框函数
const CloseDialog = () => {
    emits('update:propId', 0);
    isDialog.value = false;
}
</script>