<!-- 表格 -->
<template>
    <el-table :data="gData" style="width: 100%;">
        <el-table-column label="用户" min-width="120">
            <template #default="scope">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img :src="scope.row.avatar || 'https://example.com/avatar.jpg'" class="avatar" />
                    <span>{{ scope.row.username }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="会员等级" min-width="120">
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ scope.row.user_level?.name || '未办理会员' }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="注册时间" min-width="150">
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="状态" min-width="120">
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px"> <el-switch v-model="scope.row.status" :active-value="1"
                            :inactive-value="0" @change="handleStatusChange(scope.row)" />
                    </span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
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
</template>

<script setup>
import { Edit, Close } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { deleteUserData } from '../api/user.js';

// 接收父组件数据的变量
const props = defineProps({
    gData: Array, //只接收数组数据
})

const emits = defineEmits(['deleteuser', 'editUser'])  

// 状态改变时的处理函数
const changeStatus = async (row, value) => {
    console.log(`用户 ${row.username} 状态变为: ${value === 1 ? '启用' : '禁用'}`)

    // 调用API更新状态
    try {
        // const res = await updateUserStatus(row.id, { status: value })
        // if (res.code === 20000) {
        //     ElMessage.success('状态更新成功')
        // }
        ElMessage.success(`状态已${value === 1 ? '启用' : '禁用'}`)
    } catch (error) {
        // 如果失败，恢复原状态
        row.status = value === 1 ? 0 : 1
        ElMessage.error('状态更新失败')
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
</style>