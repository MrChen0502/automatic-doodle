<template>
    <div class="selectimage">
        <!-- 添加图片按钮 -->
        <el-icon class="addbut" size="40" @click="isDialog = true">
            <Plus />
        </el-icon>

        <!-- modelValue不为空=>展示已选择的图片：modelValue为字符串时，直接显示图片；modelValue是数组循环遍历 -->
        <main v-if="modelValue">
            <!-- 单图状态：字符串String -->
            <el-image v-if="typeof modelValue == 'string'" :src="modelValue" fit="cover" class="plusicon"
                @click="isDialog = true;" />

            <article v-else>
                <!-- 多图状态 -->
                <div class="pic_container" v-for="(item, index) in modelValue" :key="index">
                    <span @click="deleteimg(index)">X</span>
                    <el-image class="plusicon" :src="item" fit="cover" />
                </div>
            </article>
        </main>

        <!-- 对话框 -->
        <el-dialog title="选择图库" width="80%" top="2vh" v-model="isDialog">
            <el-card class="imagecard">
                <el-container style="height: 100%;">
                    <el-container>
                        <!-- 图库分类子组件 -->
                        <PicListAside ref="childFn" @changeid="changeCatelist" />
                        <!-- 图库列表子组件 -->
                        <PicListMain ref="picmainRef" mode="checkbox" @selectImgData="SelectImgFn" />
                    </el-container>
                </el-container>
            </el-card>
            <template #footer>
                <span class="dislog-footer">
                    <el-button type="info" plain @click="isDialog = false">取消</el-button>
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
import { ElMessage } from 'element-plus';

/********************************************************************* */

let isDialog = ref(false);
const childFn = ref(null);
const picmainRef = ref(null);
let avatarUrl = [];
// let arrList = ref([]);


let imgsrc = ref([]);
const props = defineProps({
    modelValue: [String, Array],
    // 设置多图选项下最多可以一次添加的最大量，默认最少一张图
    propnum: {
        type: Number,
        default: 1
    }
})
const emits = defineEmits(['update:modelValue'])

/********************************************************************* */

//创建获取子组件传递过来的数据分类ID，将id调用到查询图库列表的函数中
const changeCatelist = (cate_id) => {
    console.log(cate_id);
    picmainRef.value.getCateID(cate_id)
}

// 接收子组件传递过来的数据
const SelectImgFn = (val) => {
    console.log(val);
    avatarUrl = val.map(item => item.url)
    console.log("地址是：" + avatarUrl);
}

// 将选中的图片提交给UpdateManager父组件
const submitImg = () => {
    // 判断是多图还是单图模式
    if (props.propnum > 1) {
        // 多图模式：累加新图片
        // 数组获取原来已存在的图片数组，再获取新添加的图片数组
        const newList = [...props.modelValue, ...avatarUrl];


        // 限制最大数量
        if (newList.length > props.propnum) {
            ElMessage.warning(`最多选择${props.propnum}张图片`);
            return;
        }
        emits('update:modelValue', newList);
    } else if (props.propnum == 1) {
        emits('update:modelValue', avatarUrl[0]);
        console.log('提交的图片URL：', avatarUrl[0]);
    }
    console.log(avatarUrl);
    isDialog.value = false;
}

// 初始化图片
const deleteimg = (val) => {
    if (props.propnum > 1 && Array.isArray(props.modelValue)) {
        // 直接按索引删除
        const newList = [...props.modelValue];
        newList.splice(val, 1);
        emits('update:modelValue', newList);
        console.log('删除后的数组:', newList);
    } else if (props.propnum === 1) {
        emits('update:modelValue', '');
    }
}
</script>

<style scoped lang="less">
.selectimage {
    .addbut {
        width: 150px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed rgb(156, 156, 156);
        cursor: pointer;
    }

    article {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 10px;
        height: 200px;
        overflow-y: auto;


        .pic_container {
            position: relative;

            span {
                z-index: 100;
                width: 20px;
                height: 20px;
                position: absolute;
                right: 0;
                top: 0;
                border: 1px solid #ddd;
                background-color: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                cursor: pointer;
                font-size: 10px;
                transition: all 0.2s;
            }

            span:hover {
                background-color: #e0e0e0;
                color: #333;

            }
        }

    }

    .imagecard {
        height: 490px;
        padding-top: 20px !important;
        padding-bottom: 20px !important;
    }

    .plusicon {
        width: 150px;
        height: 100px;


    }

}

.preview-image {
    width: 100px;
    height: 100px;
}
</style>