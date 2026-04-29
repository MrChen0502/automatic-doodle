<template>
    <div class="rulescom">
        <el-card>
            <!-- 顶部 -->
            <header>
                <el-button type="success" plain @click.stop="openDialog(1)">新增</el-button>
            </header>

            <!-- 底部 -->
            <el-tree :data="data" :props="defaultProps" node-key="id" :default-expanded-keys="defaultKey">
                <template #default="{ node, data }">
                    <div class="content">
                        <!-- 左边：权限名称 -->
                        <div class="left">
                            <el-tag v-if="data.menu == 1">菜单</el-tag>
                            <el-tag type="success" v-if="data.menu == 0">权限</el-tag>
                            <el-icon>
                                <component :is="data.icon"></component>
                            </el-icon>
                            {{data.name}}
                        </div>

                        <!-- 右边：操作按钮+权限开关 -->
                        <div class="right">
                            <el-switch v-model="data.status" :inactice-value="0" :active-value="1" inactive-text="禁用" active-text="应用"/>

                            <!-- 修改 -->
                            <el-button type="warning" size="small" plain  @click.stop="openDialog(2 , data)">
                                <el-icon>
                                    <EditPen/>
                                </el-icon>
                            </el-button>

                            <el-button type="primary" size="small" plain>
                                <el-icon>
                                    <Plus />
                                </el-icon>
                            </el-button>

                            <el-button type="danger" size="small" plain @click.stop="handleDelete(data)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </div>
                    </div>
                </template>
            </el-tree>
        </el-card>

        <!-- 调用子组件 -->
         <UpdateRules v-model:propTitle="isDialog" :menuList="data" @submitok="getRulesList" :propItem="rulesList"/>
    </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import { getRulesListFn } from '../api/rules';
import UpdateRules from '../components/UpdateRules.vue';

// 树形控件数据源
const data = ref([])
// 权限列表数据
const rulesList = ref({})
// 子节点数据属性指定
const defaultKey = ref([])

// 树形结构配置
const defaultProps = {
    children: 'child',
    label: 'name'
}
let isDialog = ref('')

/*************************************************** */

// 初始化获取菜单权限列表函数
const getRulesList = async ()=>{
    let result = await getRulesListFn();
    if(result.msg != 'ok' || !result.data) return ElMessage.error(result.msg)

    // 保存数据
    data.value = result.data.list;
    rulesList.value = result.data.rulesList
    // 遍历数组，获取所有第一层数组的ID
    defaultKey.value = result.data.list.map(item=>{
        return item.id
    })
    console.log(defaultKey.value);
}
getRulesList();

// 启动对话框
const openDialog = (type,item = {}) => {
    if(type == 1){
        isDialog.value = '新增';
        rulesList.value = {};
    }else if(type == 2){
        isDialog.value = '编辑';
        rulesList.value = {...item};
    }
}

// 删除
const handleDelete = (item) => {
    ElMessageBox.confirm(
        `确定要删除"${item.name}"吗？此操作不可恢复！`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        const result = await deleteRuleFn(item.id);
        
        if (result.msg === 'ok') {
            ElMessage.success('删除成功');
            getRulesList();  // 重新加载列表
        } else {
            ElMessage.error(result.msg || '删除失败');
        }
    }).catch(() => {
        // 用户取消删除
    });
}
</script>

<style scoped lang="less">
.rulescom {


    .el-card {
        margin-top: 20px;
        height: 580px;
        overflow-y: auto;
        overflow-x: hidden;

        .el-tree {
            margin-top: 20px;

            .content{
                width: 100%;
                display: flex;
                align-items: center;
                padding-top: 20px;
                padding-bottom: 20px;

                .left{
                    width: 200px;
                    display: flex;
                    align-content: center;

                    .el-icon{
                        margin-left: 10px;
                        margin-left: 10px;
                    }
                }

                .right{
                    margin-left: auto;
                    width: 280px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .el-switch{
                    margin-right: 13px;
                }
            }
        }

        :deep(.el-tree-node__content){
            height: 40px;
        }
    }
}
</style>