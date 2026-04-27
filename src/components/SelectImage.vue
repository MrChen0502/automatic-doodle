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
                        <PicListAside ref="childFn" @changeid="changeCatelist" />
                        <!-- 图库列表子组件 -->
                        <PicListMain ref="picmainRef"  @selectImgData="SelectImgFn"/>
                    </el-container>
                </el-container>
            </el-card>
            <template #footer>
                <span class="dislog-footer">
                    <el-button type="info" plain @click="isDialog=false">取消</el-button>
                    <el-button type="primary" plain @click="submitImg">确定</el-button>
                </span>
            </template>
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
let avatarUrl = []
const props = defineProps({
    modelValue : [String , Array]
})
const emits = defineEmits(['update:modelValue'])

/********************************************************************* */

//创建获取子组件传递过来的数据分类ID，将id调用到查询图库列表的函数中
const changeCatelist = (cate_id) => {
    console.log(cate_id);
    picmainRef.value.getCateID(cate_id)
}

// 接收子组件传递过来的数据
const SelectImgFn = (val) =>{
    console.log(val);
    avatarUrl = val.map( item => item.url )
    console.log("地址是："+avatarUrl);
}

// 将选中的图片提交给UpdateManager父组件
const submitImg = () =>{
    // 修改父组件中v-model绑定的数据，将最近的modelValue传递给父组件
    if(avatarUrl.length){
        emits('update:modelValue' , avatarUrl[0])
    }
    isDialog.value = false;
}

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