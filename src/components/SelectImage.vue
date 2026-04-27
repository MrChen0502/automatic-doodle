<template>
    <div class="selectimage">
        <el-icon class="plusicon" size="40" @click=" isDialog = true">
            <Plus />
        </el-icon>

        <!-- 对话框 -->
        <el-dialog title="选择图库" width="80%" top="2vh" v-model="isDialog">
            <el-card class="imagecard">
                <el-container style="height: 100%;">
                    <el-container>
                        <!-- 图库分类子组件 -->
                        <PicListAside ref="childFn" />
                        <!-- 图库列表子组件 -->
                        <PicListMain ref="picmainRef" />
                    </el-container>
                </el-container>
            </el-card>
        </el-dialog>
    </div>
</template>



<script setup>
import { ref } from 'vue';
import PicListAside from './PicListAside.vue';
import PicListMain from './PicListMain.vue';

/********************************************************************* */

let isDialog = ref(false);
const childFn = ref(null);
const picmainRef = ref(null);

/********************************************************************* */


</script>

<style scoped>
.selectimage {
    width: 150px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed rgb(156, 156, 156);
    cursor: pointer;

    .imagecard{
        height: 490px;
        padding-top: 20px !important;
        padding-bottom: 20px !important;
    }

}
</style>