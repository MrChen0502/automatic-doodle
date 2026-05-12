<template>
    <div class="main">
        <el-main>
            <div class="piclistMain" v-loading="isLoading" element-loading-text="加载中 ing...">
                <el-row :gutter="20">
                    <el-col :span="6" v-for="item in data.piclist" :key="item.id">
                        <el-card shadow="hover">
                            <!-- 图片 -->
                            <el-image fit="cover" :src="item.url" :preview-src-list="[item.url]" />
                            <p>{{ item.name }}</p>
                            <!-- 操作区 -->
                            <div class="pic_edit" v-if="route.path == '/admin/image/list'">
                                <span @click="openDiaChangePicName(item)">重命名</span>
                                <span @click="updatePic(item.id)">删除</span>
                            </div>
                            <!-- 多个路由显示复选框 -->
                            <div class="pic_edit"
                                v-else-if="['/admin/manager/list', '/admin/user/list'].includes(route.path)">
                                <el-checkbox v-model="item.checked" @change="selecetImgFn(item)" />
                            </div>
                        </el-card>
                    </el-col>

                    <!-- 空状态 -->
                    <el-empty v-if="!isLoading && data.piclist.length == 0" description="暂无图片" />
                </el-row>
            </div>
            <div class="page">
                <el-pagination v-model:current-page="queryData.currentPage" layout="total, prev, pager, next, jumper"
                    :total="data.total" @current-change="handleCurrentChange" />
            </div>
        </el-main>

        <!-- 对话框 -->
        <el-dialog v-model="data.isDialog" title="图片重命名" width="30%" @close="cancelDia">
            <el-form label="图片ID">
                <el-form-item>
                    <el-input v-model="formPicName.id" :readonly="true" />
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="请输入图片名称" v-model="formPicName.name" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="info" @click="cancelDia">取消</el-button>
                    <el-button type="primary" @click="editPicNameFn" :loading="data.btnLoading">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 上传图片对话框 -->
        <el-dialog v-model="uploadData.diaUpload" title="上传图片" width="40%">
            <p>
                当前图库分类ID:{{ queryData.id }}
            </p>
            <UploadCom :data="{ image_class_id: queryData.id }" @uploadadd="uploadaddsuccess" />
        </el-dialog>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { getPicList } from '@/api/pics.js';
import { ElMessage } from 'element-plus';
import { editPicName, delPic } from '@/api/pics';
import { ElMessageBox } from 'element-plus';
import UploadCom from './UploadCom.vue';
import { useRoute } from 'vue-router';

let isLoading = ref(false)



// 定义接口参数的对象集合
const queryData = reactive({
    // 分类id
    id: 0,
    // 当前页码
    page: 1,
    // 限制每页条数
    limit: 8
})

// 定义数据变量
const data = reactive({
    piclist: [],  //图库列表数据
    total: 0, //总页数
    isDialog: false, //控制对话框的显示隐藏
    btnLoading: false //禁止重复提交
})

// 表单数据
const formPicName = reactive({
    id: '',
    name: ''
})

// 上传对话框的数据
const uploadData = reactive({
    diaUpload: false,  //上传图片对话框的显示隐藏控制
})

// 初始化路由对象
const route = useRoute();
const emits = defineEmits(['selectImgData'])

// 分页事件
const handleCurrentChange = (p) => {
    queryData.page = p;

    // 发起新一页数据请求
    getPics();
}

// 点击重命名链接：打开对话框传递当前重命名的图片数据
const openDiaChangePicName = (val) => {
    data.isDialog = true
    // 显示当前需要重命名的图片原来的名称
    formPicName.name = val.name
    formPicName.id = val.id
}

// 确定提交新图片名称
const editPicNameFn = async () => {
    // 确定按钮点击是触发禁用
    data.btnLoading = true

    let result = await editPicName(formPicName.id, formPicName.name);

    if (result.msg != 'ok' || !result.data) return ElMessage.error('提交失败，请重试！！！')

    getPics();
    // 去掉禁用
    data.btnLoading = false
    cancelDia();
}

// 单个删除
const updatePic = async (id) => {
    try {
        await ElMessageBox.confirm(
            '确定要删除该图吗？删除后无法恢复！',
            '删除确认',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        let result = await delPic([id]);

        if (result.msg === 'ok') {
            ElMessage.success('删除成功')
            // 删除成功后再刷新列表
            getPics();
        } else {
            ElMessage.error(result.msg || '删除失败')
        }
    } catch {
        ElMessage.info('已取消删除')
    }
}

// 关闭对话框
const cancelDia = () => {
    // 还原表单数据
    formPicName.id = 0;
    formPicName.name = '';
    // 关闭对话框
    data.isDialog = false;
}

// 定义父组件传递过来的分类ID，并且调用请求接口函数
const getCateID = (cate_id) => {
    queryData.id = cate_id;
    // 调用请求函数
    getPics();
}

// 调用请求接口函数
const getPics = async () => {
    isLoading.value = true

    let result = await getPicList(queryData.id, queryData.page, queryData.limit);
    isLoading.value = false

    if (result.msg != 'ok' || !result.data) {
        ElMessage.error('图片加载失败！！！')
        return
    }

    // 根据路由决定是否需要 checked 属性
    switch (route.path) {
        case '/admin/manager/list':
        case '/admin/user/list':
            data.piclist = result.data.list.map(item => {
                item.checked = false;
                return item;
            });
            break;
        case '/admin/image/list':
            data.piclist = result.data.list;
            break;
        default:
            data.piclist = result.data.list;
    }

    data.total = result.data.totalCount
}

// 创建启动上传图片对话框函数
const openUpload = () => {
    uploadData.diaUpload = true;
}

// 创建关闭上传图片对话框函数
const closeUploadDia = () => {
    uploadData.diaUpload = false
}

// 处理上传成功
const uploadaddsuccess = () => {
    // 刷新图片列表
    getPics();

    // 延迟0.5秒关闭，让用户看到成功状态
    setTimeout(() => {
        // 关闭对话框
        uploadData.diaUpload = false;
    }, 500)

}

// 设置计算属性，将data.piclist数组中被选中的图片筛选出来：将每一组数组中的checked进行判断
const checkedIMG = computed(() => {
    // 过滤条件：checked属性为true
    return data.piclist.filter(item => item.checked)
})

// 当每一个复选框分别触发改变事件时都将进行以下操作：1.判断是否有选中图片；2.是否多选了图片
const selecetImgFn = (val) => {
    if (val.checked) {
        // 先把所有图片取消选中
        data.piclist.forEach(item => {
            item.checked = false
        })
        // 再把当前这张选中(一次只能选中一张图片)
        val.checked = true
    }
    emits('selectImgData', checkedIMG.value)
}

// 将获取分类ID并请求数据的函数共享给父组件:只要父组件传ID给我的时候，那么直接自动调用请求函数
defineExpose({
    getCateID, openUpload
})
</script>

<style scoped lang="less">
.main {
    width: 100%;
    height: 100%;
}

.el-main {
    height: 100%;
    position: relative;

    .piclistMain {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 50px;
        right: 0;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 15px;
        box-sizing: border-box;

        .el-card {
            margin-bottom: 15px;
            position: relative;

            :deep(.el-card__body) {
                padding: 0 !important;
            }

            .el-image {
                height: 170px;
                width: 100%;
            }

            p {
                text-align: center;
                width: 100%;
                height: 30px;
                line-height: 30px;
                color: white;
                background-color: rgba(0, 0, 0, 0.75);
                margin: 0;
                padding: 0;
                margin-top: -10px;
                bottom: 30px;
                left: 0;
                overflow: hidden;
            }

            .pic_edit {
                text-align: center;
                height: 30px;
                line-height: 30px;
                padding-bottom: 5px;

                span {
                    padding-right: 15px;
                    color: #409eff;
                    cursor: pointer;
                }
            }
        }
    }

    .page {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 0;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>