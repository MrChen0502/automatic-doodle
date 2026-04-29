<!-- IconSelect.vue -->
<template>
    <div class="iconselect">
        <el-select v-model="currentIcon" placeholder="请选择icon图标" @change="ChangeIconFn">
            <el-option v-for="item in iconsList" :key="item" :label="item" :value="item">
                <el-icon>
                    <component :is="item"></component>
                </el-icon>
                {{ item }}
            </el-option>
        </el-select>
        <!-- 显示选中的图标 -->
        <el-icon size="20" v-if="currentIcon">
            <component :is="currentIcon"></component>
        </el-icon>
    </div>
</template>

<script setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ref, watch } from 'vue'

const iconsList = ref(Object.keys(ElementPlusIconsVue))

//  接收父组件传来的 propicon
const props = defineProps({
    propicon: {
        type: String,
        default: ''
    }
})

const emits = defineEmits(['update:propicon'])

//  用父组件传来的值初始化 currentIcon
let currentIcon = ref(props.propicon || '')

// 监听父组件传来的 propicon 变化（编辑回显时）
watch(() => props.propicon, (newVal) => {
    currentIcon.value = newVal || ''
})

// 下拉菜单的改变事件
const ChangeIconFn = (val) => {
    currentIcon.value = val
    emits('update:propicon', val)
}
</script>

<style scoped>
.iconselect {
    width: 100%;
    display: flex;
    align-items: center;

    .el-select {
        width: 200px;
        margin-right: 8px;
    }
}
</style>

<style scoped>
.iconselect{
    width: 100%;
    display: flex;
    align-items: center;

    .el-select{
        width: 200px;
        margin-right: 8px;
    }
}
</style>