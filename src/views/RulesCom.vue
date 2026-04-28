<template>
    <div class="rulescom">
        <el-card>
            <!-- 顶部 -->
            <header>
                <el-button type="success" plain @click="openDialog">新增</el-button>
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

                            <el-button type="warning" size="small" plain>
                                <el-icon>
                                    <EditPen />
                                </el-icon>
                            </el-button>

                            <el-button type="primary" size="small" plain>
                                <el-icon>
                                    <Plus />
                                </el-icon>
                            </el-button>

                            <el-button type="danger" size="small" plain>
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
         <UpdateRules v-model:propTitle="isDialog" :menuList="data" @submitok="getRulesList"/>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { getRulesListFn } from '../api/rules';
import UpdateRules from '../components/UpdateRules.vue';

// 树形控件数据源
const data = ref([])
// 权限列表数据
const rulesList = ref([])
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
const openDialog = ()=>{
    isDialog.value = '新增';
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