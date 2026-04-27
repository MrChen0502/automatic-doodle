<template>
    <div class="piclist">
        <el-card :style="{ height: cardHeight + 'px' }">
            <!-- 头部 -->
            <el-container style="height: 100%;">
                <el-header class="p_title">
                    <el-button type="primary" size="small" @click="isDialog = true">新增分类</el-button>
                    <el-button type="warning" size="small" @click="openDialogupload">上传图片</el-button>
                </el-header>
                <!-- 底部:划分左右 -->
                <el-container>
                    <!-- 图库分类子组件 -->
                    <PicListAside ref="childFn" @edit="editCateItem" @changeid="changeCatelist" />
                    <!-- 图库列表子组件 -->
                    <PicListMain ref="picmainRef" />
                </el-container>
            </el-container>
        </el-card>

        <!-- 添加图库分类对话框 -->
        <el-dialog v-model="isDialog" :title="titleVal" width="40%" @close="closeDialog">
            <el-form ref="ruleAddPicDOM" :model="AddPicData" :rules="ruleAddPic">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="AddPicData.name"></el-input>
                </el-form-item>
                <el-form-item label="分类排序" prop="order">
                    <el-input-number v-model="AddPicData.order" @change="handleChangeOrder"></el-input-number>
                </el-form-item>
            </el-form>
            <template #footer>
                <div>
                    <el-button @click="closeDialog">取消</el-button>
                    <!-- :disabled=" isDisabled" -->
                    <el-button type="primary" @click="addPicCate">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import PicListAside from '../components/PicListAside.vue';
import PicListMain from '../components/PicListMain.vue';
import { getPicsCateList, addPicsCateList, editPicsCateList } from '@/api/pics'
import { ElMessage } from 'element-plus';
import UploadCom from '@/components/UploadCom.vue';


// 获取当前窗口/当前浏览器的高度
const windowHeight = window.innerHeight || document.body.clientHeight;
// let cardHeight = ref(windowHeight - 170)
let cardHeight = ref(windowHeight - 170)

// 对话框控制变量
let isDialog = ref(false)
let isDialogs = ref(false)

// 声明接收子组件暴露函数的变量
let childFn = ref(null)

// 对话框标题
let titleVal = ref('新增图库分类')
let titlepic = ref('添加图片')

// 声明子组件对象
const picmainRef = ref(null)

// 初始化表单数据
let ruleAddPicDOM = ref(null)
let AddPicData = reactive({
    name: '',
    order: 10,
})

let edit_id = ref(null)  //存储数据的id


const ruleAddPic = reactive({
    name: [
        { required: true, message: '请输入图库分类名称', trigger: 'blur' }
    ],
    order: [
        { required: true, message: '请输入分类排序', trigger: 'blur' }
    ]
})

// 修改排序数字
const handleChangeOrder = (val) => {
    AddPicData.order = val;
}

// 添加/编辑图库分类
const addPicCate = () => {
    // 确定验证规则是否全部通过
    ruleAddPicDOM.value.validate(async isVali => {
        // 如果有任意一项不通过，isVal为false
        if (!isVali) return

        // 先判断执行的操作是添加/编辑
        if (titleVal.value == '新增图库分类') {
            // 通过验证发起添加图库分类请求
            let result = await addPicsCateList(AddPicData)
            if (result.msg != 'ok' || !result.data) {
                ElMessage.error('新增失败')
                return
            }
        } else if (titleVal.value == '编辑图库分类') {
            let result = await editPicsCateList(edit_id.value, AddPicData);

            // 判断
            if (result.msg != 'ok' || !result.data) {
                ElMessage.error('编辑失败')
                return
            }
        }

        // 重新查询数据——调用子组件暴露的查询方法
        childFn.value.getPicCateData();

        // 无论是添加/编辑，最后都将执行关闭对话框操作
        closeDialog();
    })
}

// 由子组件的按钮点击之后出发的父组件的函数
/** val参数负责接收由子组件传递过来的数据 */
const editCateItem = (val) => {
    titleVal.value = '编辑图库分类'
    AddPicData.name = val.name;
    AddPicData.order = val.order;
    edit_id.value = val.id

    isDialog.value = true;
}

// 关闭对话框
const closeDialog = () => {
    // 数据初始化
    titleVal.value = '新增图库分类'
    // 清空表单数据
    AddPicData.name = ''
    AddPicData.order = 10
    edit_id.value = null

    // 重置验证规则DOM记录
    ruleAddPicDOM.value.resetFields();
    // 关闭弹窗
    isDialog.value = false
}

//创建获取子组件传递过来的数据分类ID，将id调用到查询图库列表的函数中
const changeCatelist = (cate_id) => {
    console.log(cate_id);
    picmainRef.value.getCateID(cate_id)
}

// 初始化上传图片点击事件函数
const openDialogupload = () => {
    // 调用子组件PicListMain共享的函数
    picmainRef.value.openUpload();
}
</script>

<style scoped lang="less">
.piclist {
    width: 100%;
    height: 100%;

    .el-card {
        margin-top: 20px;
        padding-top: 0px !important;

        .p_title {
            border-bottom: 1px solid #dbdbdb;
            display: flex;
            align-items: center;
        }
    }

    :deep(.el-card__body) {
        padding-top: 0px !important;
        height: 100%;
    }
}
</style>