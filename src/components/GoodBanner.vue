<template>
    <el-dialog v-model="isDialog" title="设置轮播图" :title="propTitle" width="40%" destroy-on-close @close="CloseDialog">
        <el-form :model="FormModel" v-loading="isLoading">
            <el-form-item label="轮播图">
                <!-- 调用图像选择子组件，v-model绑定,如多图状态下，子组件设置限制数量 -->
                <SelectImage v-model="FormModel.banners" :propnum="5"/>
            </el-form-item>
            <!-- 设置两个按钮：取消和确定 -->
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="CloseDialog">取消</el-button>
                <el-button style="background-color: #1AA094;color: white; " @click="submitOK">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import SelectImage from './SelectImage.vue';
import { getGoodsMessageFn , setGoodBannersFn } from '../api/goods';
import { ElMessage } from 'element-plus';

let isDialog = ref(false);
let isLoading = ref(false);
// 表单数据对象
const FormModel = reactive({
    banners: []
})

const props = defineProps({
    propID: Number,
})

const emits = defineEmits(['update:propID'])

/********************************************************************************* */
// 启动监听器
watch(() => props.propID, (newVal) => {
    if (newVal != 0) {
        console.log("1");
        OpenDialog();
    } else {
        console.log("2");
        CloseDialog();
    }
})

// 初始化确认按钮提交表单数据
const submitOK = async()=>{
    let result = await setGoodBannersFn( props.propID , FormModel )
    console.log(result);

    if(result.msg != 'ok' || !result.data)return ElMessage.error(result.msg)

    ElMessage.success('设置轮播图成功！！！');
    CloseDialog();
}

// 启动对话框
const OpenDialog = async () => {
    isDialog.value = true;
    isLoading.value = true;

    // 发起请求
    let result = await getGoodsMessageFn(props.propID);
    console.log(result);

    isLoading.value = false;

    if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg);

    // 数据赋值
    FormModel.banners = result.data.goodsBanner.map(item => item.url)

}

// 关闭对话框
const CloseDialog = () => {
    emits('update:propID', 0);
    isDialog.value = false;
}
</script>

<style scoped lang="less"></style>