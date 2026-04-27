<template>
    <el-upload action="/api/admin/image/upload" method='post' :headers="{ token }" :data="data"
        :on-success='onSuccessFn' :on-error='onErrorFn' drag name="img">
        <el-icon class="el-icon-upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
            拖拽在此处或者 <em>点击此处上传图片</em>
        </div>
        <template #tip>
            <div class="el-upload__tip">
                所上传的图片文件大小不得超过500kb
            </div>
        </template>
    </el-upload>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';

const emit = defineEmits(['uploadadd'])

// 获取token
const token = ref(window.sessionStorage.getItem('token'))

const prop = defineProps({
    data: Object
})

// 上传成功触发的函数
const onSuccessFn = (response, uploadFile, uploadFiles) => {
    console.log('上传成功：' + response);
    emit('uploadadd', response);
    ElMessage.success('上传成功')
}

// 上传失败触发的函数
const onErrorFn = (error, uploadFile, uploadFiles) => {
    console.log('上传失败:' + error);
    ElMessage.error('上传失败')
}
</script>

<style></style>