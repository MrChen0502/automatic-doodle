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
import { ref } from 'vue'

const iconsList = ref(Object.keys(ElementPlusIconsVue))


let currentIcon = ref('')

defineProps({
    propicon : String
})

const emits = defineEmits(['update:propicon'])


// 下拉菜单的改变事件：每一次给变都将选中的图标传递给父组件
const ChangeIconFn = (val)=>{
    currentIcon.value = val
    emits('update:propicon' , val)
}
</script>

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