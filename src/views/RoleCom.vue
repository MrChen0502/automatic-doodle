<template>
    <div class="rolecom">
        <el-card>
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
                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"></el-switch>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scoped">
                        <div>
                            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                                <el-button type="primary" plain size="small"><el-icon>
                                        <Share />
                                    </el-icon></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="修改权限" placement="top" :enterable="false">
                                <el-button type="primary" plain size="small" @click="editRoleFn(scoped.row.id)"><el-icon>
                                        <Edit />
                                    </el-icon></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除权限" placement="top" :enterable="false">
                                <el-button type="danger" plain size="small"><el-icon>
                                        <Share />
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
         <UpdateRole v-model:propTitle="title"/>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { getRoleListFn } from '../api/role';
import { ref } from 'vue';
import UpdateRole from '../components/UpdateRole.vue';
/********************************************************************* */

let page = ref(1);              //当前页码，默认第一页
let total = ref(0);             //总数据数
let tableData = ref([]);        //角色列表数组
let isLoading = ref(false)      //表格数据加载中
let title = ref(null);          //子组件对话框的标题

/********************************************************************* */

// 初始化角色列表查询函数
const getRolesListFn = async () => {
    isLoading.value = true
    let result = await getRoleListFn(page.value);
    console.log(result);

    if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg);

    tableData.value = result.data.list;
    isLoading.value = false;
    total.value = result.data.totalCount;
}
getRolesListFn();

// 初始化编辑函数
const editRoleFn = (id)=>{
    console.log(id);
    title.value = '编辑函数'
}

// 分页
const handleCurrent = (val) => {
    page.value = val
    getRolesListFn();
}
</script>

<style scoped>

</style>