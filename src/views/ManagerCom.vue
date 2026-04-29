<template>
    <div class="managercom">
        <el-card>
            <el-row :gutter="30">
                <!-- 搜索框 -->
                <el-col :span="8">
                    <el-input v-model="keyword" placeholder="请输入管理员" @keyup.enter="handSearchUser" clearable>
                        <template #append>
                            <el-button :icon="Search" @click="handSearchUser"></el-button>
                        </template>
                    </el-input>
                </el-col>

                <!-- 添加管理员按钮 -->
                <el-col :span="8">
                    <el-button type="primary" @click="openDialog(1)">添加管理员</el-button>
                </el-col>
            </el-row>

            <!-- 表格部分保持不变 -->
            <el-table :data="tableData" style="width: 100%;" v-loading="isLoading">
                <el-table-column label="管理员头像及用户名">
                    <template #default="scoped">
                        <div class="avatar">
                            <el-avatar :size="50" :src="scoped.row.avatar"></el-avatar>
                            {{ scoped.row.username }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="角色权限" prop="role.name"></el-table-column>
                <el-table-column label="账号状态">
                    <template #default="scoped">
                        <div>
                            <el-switch v-model="scoped.row.status" :active-value="1" :inactive-value="0"
                                active-text="正常" inactive-text="禁用"></el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scoped">
                        <div>
                            <el-button type="primary" @click="openDialog(2, scoped.row)"><el-icon>
                                    <Edit />
                                </el-icon></el-button>
                            <el-button type="warning" @click="deleteuser(scoped.row)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区 -->
            <div class="page">
                <el-pagination :total="total" v-model:current-page="page" @current-change="handleCurrent" />
            </div>
        </el-card>
        <UpdateManager v-model:propTitle="ParentData.title" :roleList="rolelist" :propItem="currentEditItem" />
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Search, Edit, Delete } from '@element-plus/icons-vue';
import { getManager, getaddManager} from '@/api/manager';
import { ElMessage, ElMessageBox } from 'element-plus';
import UpdateManager from '../components/UpdateManager.vue';
import { DeleteManager } from '../api/manager';

let keyword = ref(null)
let page = ref(1)
let limit = ref(5)
let total = ref(0)
let tableData = ref([])
let isLoading = ref(true)
let isDialog = ref(false)
let ruleAddmanageDOM = ref(null)
let switchLoading = ref(false)
let rolelist = ref([])
// 定义存储当前编辑项的数据
let currentEditItem = ref({})

// 父组件要传给子组件的数据
let ParentData = reactive({
    title: ''
})

// 获取管理员列表
const getDataList = async () => {
    isLoading.value = true;
    let result = await getManager(page.value, limit.value, keyword.value);
    if (result.msg != 'ok' || !result.data) {
        isLoading.value = false;
        return ElMessage.error('获取数据失败');
    }
    tableData.value = result.data.list;
    total.value = result.data.totalCount;
    rolelist.value = result.data.roles;
    isLoading.value = false;
}
getDataList();

// 搜索用户
const handSearchUser = () => {
    page.value = 1
    getDataList()
    // 这里不要清空keyword，否则搜索无效
    // keyword.value = ''  // 删除这行
}

// 分页
const handleCurrent = (val) => {
    page.value = val
    getDataList();
}

// 打开添加弹窗
// 如果type=1，启动添加管理员对话框;如果type=2启动编辑管理员对话框
// 如果item为空，则启动添加管理员对话框;如果item不为空则启动编辑管理员对话框:
const openDialog = (type, item = {}) => {
    isDialog.value = true

    switch (type) {
        case 1:
            // 添加管理员
            ParentData.title = '添加管理员'
            currentEditItem.value = {}  // 添加时清空
            break;
        case 2:
            // 编辑管理员
            ParentData.title = '编辑管理员'
            currentEditItem.value = { ...item }  // 保存当前行数据
            break;
    }
}

// 取消
const handCancel = () => {
    isDialog.value = false;
    // 清空表单验证提示
    ruleAddmanageDOM.value?.clearValidate()
}

// 删除管理员
const deleteuser = (item) =>{
    ElMessageBox.confirm(
        `确定要删除"${item.keyword}"吗？此操作不可恢复！`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        const result = await DeleteManager(item.id);
        
        if (result.msg === 'ok') {
            ElMessage.success('删除成功');
            getDataList();  // 重新加载列表
        } else {
            ElMessage.error(result.msg || '删除失败');
        }
    }).catch(() => {
        // 用户取消删除
    });
}

</script>

<style scoped lang="less">
.el-card {
    margin-top: 20px;
}

.page {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.el-table {
    margin-top: 20px;
}

.avatar {
    display: flex;
    align-items: center;

    .el-avatar {
        margin-right: 15px;
    }
}
</style>