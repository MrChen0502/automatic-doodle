<template>
    <div class="goodsskuaddtag">
        <!-- 循环：当前商品具有多规格数据 -->
        <el-tag closable :disable-transitions="false">
            <el-input class="inputStyle"></el-input>
        </el-tag>

        <el-input v-if="inputVisiable" class="inputStyle" size="small"></el-input>

        <el-button v-else size="small" style="margin-left: 5px;">+ New Tag</el-button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

let inputVisiable = ref(false);
</script>

<style>
.el-tag{
    margin-right: 6px;
}
:deep(.el-input) {
    height: 20px !important;
    font-size: 13px;
}

.inputStyle {
    width: 70px;
    height: 20px;
}
</style>