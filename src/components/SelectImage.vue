<template>
    <div class="selectimage">
        <el-icon><Plus /></el-icon>

        <!-- 对话框 -->
         <el-dialog title="选择图库" width="80%" top="2vh" v-model="isDialog"></el-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';

let isDialog = ref(false);
</script>

<style scoped></style>