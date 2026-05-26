<template>
    <div class="goodsskuaddtag">
        <!-- 循环：当前商品具有多规格数据 -->
        <el-tag closable :disable-transitions="false" v-for="(tag, index) in tagList.goodsSkusCardValue" :key="index"
            @close="deleteTag(tag)">
            <el-input class="inputStyle" v-model="tag.text" @change="editTag($event, tag)"></el-input>
        </el-tag>

        <!-- 失去焦点、敲击回车键：实现添加tag标签的操作 -->
        <el-input v-if="inputVisiable" class="inputStyle" size="small" v-model="inputVal" ref="inputRef"
            @blur="InputBlur()" @keyup.enter="InputBlur()"></el-input>

        <el-button v-else size="small" style="margin-left: 5px;" @click="showInput">+ New Tag</el-button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { initSkuItemVal } from '../api/useSku';

// 接收父组件传递过来的规格ID
const props = defineProps({
    skuID: [Number, String]
})

// 向函数内传递规格ID
const { tagList,
    inputVisiable,
    inputVal,
    inputRef,
    InputBlur,
    deleteTag,
    editTag,
    showInput } = initSkuItemVal(props.skuID);
</script>

<style>
.el-tag {
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