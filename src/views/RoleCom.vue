<template>
    <div class="rolecom">
        <el-card style="height: 100vh;">
            <!-- 顶部：添加按钮 -->
            <el-button type="primary" size="small" @click="title = '新增角色'">新增</el-button>

            <!-- 底部：表格 -->
            <el-table :data="tableData" stripe border style="width: 100%; height: 450px;">
                <el-table-column label="角色ID" prop="id"></el-table-column>
                <el-table-column label="角色名称" prop="name"></el-table-column>
                <el-table-column label="角色描述" prop="desc"></el-table-column>
                <el-table-column label="角色最近更新时间" prop="update_time"></el-table-column>
                <el-table-column label="角色状态">
                    <template #default="scoped">
                        <div class="">
                            <!-- 状态:switch -->
                            <el-switch v-model="scoped.row.status" inline-prompt active-text="使用" inactive-text="禁用"
                                :active-value="1" :inactive-value="0"
                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                "></el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scoped">
                        <div>
                            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                                <el-button type="warning" plain size="small" @click="setRolesfn(scoped.row)"><el-icon>
                                        <Share />
                                    </el-icon></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="修改权限" placement="top" :enterable="false">
                                <el-button type="primary" plain size="small" @click="editRoleFn(scoped.row)"><el-icon>
                                        <Edit />
                                    </el-icon></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除权限" placement="top" :enterable="false">
                                <el-button type="danger" plain size="small"
                                    @click="deleteRoleFn(scoped.row.id)"><el-icon>
                                        <Delete />
                                    </el-icon></el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pageArea">
                <el-pagination v-model:current-page="page" :page-size="0" layout="total , prev , pager , next"
                    :total="total" style="justify-content: center;" @current-change="handleCurrent"></el-pagination>
            </div>
        </el-card>

        <!-- 添加/修改角色对话框组件 -->
        <UpdateRole v-model:propTitle="title" @insert="getRolesListFn" :propItem="orderItem" />

        <!--  -->
        <RolueSetRule v-model:propID="orderID" @insert="getRolesListFn" />
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { getRoleListFn, DelRoleFn , EditRoleStatusFn } from '../api/role';
import { ref } from 'vue';
import UpdateRole from '../components/UpdateRole.vue';
import RolueSetRule from '../components/RolueSetRule.vue';
import { ElMessageBox } from 'element-plus';
/********************************************************************* */

let page = ref(1);              //当前页码，默认第一页
let total = ref(0);             //总数据数
let tableData = ref([]);        //角色列表数组
let isLoading = ref(false)      //表格数据加载中
let title = ref(null);          //子组件对话框的标题
let orderItem = ref({});        //子组件编辑时的个人数据
let orderID = ref(null);          //子组件分配权限时的角色ID


/********************************************************************* */

// 初始化角色列表查询函数
const getRolesListFn = async () => {
    isLoading.value = true
    let result = await getRoleListFn(page.value);
    console.log("点击当前查询到的数据是：" + result);

    if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg);

    tableData.value = result.data.list;
    isLoading.value = false;
    total.value = result.data.totalCount;
}
getRolesListFn();

// 初始化编辑函数
const editRoleFn = (item) => {
    console.log(item);
    orderItem.value = item;
    title.value = '编辑角色'
}

// 分页
const handleCurrent = (val) => {
    page.value = val
    getRolesListFn();
}

// 初始化启动权限分配弹窗函数:将当前需要分配权限的角色数据整个传给子组件
const setRolesfn = (item) => {
    console.log("点击查询当前数据" + item);
    orderID.value = item;
}

// 删除权限
const deleteRoleFn = (id) => {

    ElMessageBox.confirm(
        '确定要关闭这个标签吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(async () => {
        let result = await DelRoleFn(id);
        if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg)

        ElMessage.success('删除成功')
        getRolesListFn();
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

// 修改角色状态 - 完整版
const changeRoleStatus = async (row) => {
    // 防止重复点击
    if (row.statusLoading) return;

    row.statusLoading = true;

    try {
        const result = await EditRoleStatusFn(row.id, row.status);

        console.log('状态修改结果：', result);

        if (result.msg === 'ok' || result.code === 200) {
            ElMessage.success(`已${row.status === 1 ? '启用' : '禁用'}角色：${row.name}`);
        } else {
            // 修改失败，恢复原状态
            row.status = row.status === 1 ? 0 : 1;
            ElMessage.error(result.msg || '状态修改失败');
        }
    } catch (error) {
        console.error('状态修改失败：', error);
        // 失败时恢复原状态
        row.status = row.status === 1 ? 0 : 1;
        ElMessage.error('状态修改失败，请检查网络');
    } finally {
        row.statusLoading = false;
    }
};
</script>

<style scoped></style>