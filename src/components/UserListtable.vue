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
        <el-table-column label="会员等级" min-width="120" >
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
                    <span style="margin-left: 10px">    <el-switch  v-model="scope.row.status" 
            :active-value="1" 
            :inactive-value="0"
            @change="handleStatusChange(scope.row)" />
                    </span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120">
            <template #default="scope">
                <div style="display: flex; align-items: center" class="Operation">
                    <span style="margin-left: 10px">
                        <el-icon><Edit/></el-icon>
                        <el-icon><Close/></el-icon>
                    </span>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup>
import { Edit , Close }  from '@element-plus/icons-vue';

// 接收父组件数据的变量
const props = defineProps({
    gData: Array, //只接收数组数据
})

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

.Operation{
    cursor: pointer;
}
</style>