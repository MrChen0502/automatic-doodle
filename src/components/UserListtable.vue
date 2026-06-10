<!-- 表格 -->
<template>
    <el-table :data="gData" style="width: 100%;" stripe v-loading="isLoading">
        <el-table-column label="用户" min-width="120" align="center">
            <template #default="scope">
                <div style="display: flex; align-items: center; gap: 10px; margin-left: 40px;">
                    <img :src="scope.row.avatar || 'https://example.com/avatar.jpg'" class="avatar" />
                    <span>{{ scope.row.username }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="会员等级" min-width="120" align="center">
            <template #default="scope">
                <div>
                    <span style="margin-left: 10px">{{ scope.row.user_level?.name || '未办理会员' }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="注册时间" min-width="150" align="center">
            <template #default="scope">
                <div>
                    <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="状态" min-width="120" align="center">
            <template #default="scope">
                <span style="margin-left: 10px">
                    <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"/>
                    <!-- @change="handleStatusChange(scope.row.id , scope.row.status)"  -->
                </span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
                <el-button type="primary" @click="handleEdit(scope.row)">
                    <el-icon>
                        <Edit />
                    </el-icon>
                </el-button>
                <el-button type="danger" @click="handleDelete(scope.row)">
                    <el-icon>
                        <Delete />
                    </el-icon>
                </el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalCount"
            :page-sizes="[1, 10, 20, 50, 70, 100]" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
</template>

<script setup>
import { Edit, Close } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { deleteUserData, updateUserData } from '../api/user.js';
import { ref } from 'vue';

let currentPage = ref(1)    // 当前页码，默认为1
let pageSize = ref(10)      // 每页条数，默认为10
// let totalCount = ref(0)     // 总条数，默认为0

// 接收父组件数据的变量
const props = defineProps({
    gData: Array, //只接收数组数据
    isLoading : Boolean,
    totalCount: Number
})

const emits = defineEmits(['deleteuser', 'editUser'])

// 状态改变时的处理函数
const handleStatus = async (id , newStatus) => {
    isLoading.value = true;
    const res = null;
    try {
        const updateData = {
            status: newStatus 
        }
        res = await updateUserData(Number(id), updateData)
        if (res.msg != 'ok' || !res.data) ElMessage.error(res.msg)
    } finally {
        isLoading.value = false;
    }
}

// 编辑按钮点击
const handleEdit = (item) => {
    console.log('编辑', item)
    emits('editUser', item)  // 触发父组件的编辑事件
}

// 删除按钮点击
const handleDelete = (item) => {
    ElMessageBox.confirm(
        `确定要删除"${item.username}"吗？`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        console.log("确定删除，用户ID:", item.id);

        try {
            // 执行删除操作
            let result = await deleteUserData(item.id)
            console.log("删除结果:", result);

            if (result.msg != 'ok' || !result.data) {
                // 删除失败 - 显示后端返回的错误信息
                ElMessage.error(result.msg || '删除失败')
                return  // 终止执行
            }

            // 删除成功
            ElMessage.success('删除成功！')
            emits('deleteuser')  // 通知父组件刷新列表

        } catch (error) {
            // 网络错误或其他异常
            console.error('删除请求失败:', error)
            ElMessage.error('网络请求失败，请检查网络连接或联系管理员')
        }

    }).catch((error) => {
        // 取消删除或其他错误
        if (error === 'cancel') {
            console.log("用户取消删除")
            ElMessage.info('已取消删除')
        } else {
            console.error('删除操作异常:', error)
            ElMessage.error('操作异常，请重试')
        }
    })
}

// 
const handleSizeChange = (val) => {
    pageSize.value = val
    currentPage.value = 1
    emits('deleteuser');
}

const handleCurrentChange = () => {
    emits('deleteuser');
}
</script>

<style scoped>
/* 只优化头像和行高 */
.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
}

:deep(.el-table__body tr) {
    height: 65px;
}

.Operation {
    cursor: pointer;
}

.el-table {
    border: 1px solid rgb(192, 192, 192);
    margin-top: 15px;
    height: calc(98vh - 260px);
}

.pagination {
    margin-top: 15px;
    display: flex;
    justify-content: center;
}
</style>