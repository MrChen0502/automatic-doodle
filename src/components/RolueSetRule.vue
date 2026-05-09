<template>
    <div class="rolesetrule">
        <el-dialog v-model="isDialog" title="分配角色" width="30%" @close="CloseDialog">
            <!-- 树形控件 -->
            <el-tree-v2 ref="treeref" node-key="id" :props="treeProps" :data="roleData"
                :default-expanded-keys="defaultRoles" show-checkbox :height="360" :check-strictly="true">

                <template #default="{ node, data }">
                    <span>
                        <el-tag v-if="data.menu == 1">菜单</el-tag>
                        <el-tag type="success" v-if="data.menu == 0">权限</el-tag>
                        <el-icon v-if="data.icon && data.icon !== ''">
                            <component :is="data.icon"></component>
                        </el-icon>
                        {{ data.name }}
                    </span>
                </template>
            </el-tree-v2>

            <template #footer>
                <span class="disalog-footer">
                    <el-button type="info" plain @click="CloseDialog">取消</el-button>
                    <el-button color="#1AA094" @click="handleConfirm">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue';
import { getRulesListFn } from '../api/rules';
import { setRolesFn } from '../api/role';
import { ElMessage } from 'element-plus';
/************************************************************************ */

let isDialog = ref(false);
let roleData = ref([])          //权限列表配数据
let defaultRoles = ref([]);      //设置默认展开第一级菜单
let treeref = ref(null);
// 控件配置对象数据
let treeProps = reactive({
    value: 'id',           //获取每条数据的ID属性
    label: 'name',         //展示的内容以每条数据的name属性为主
    children: 'child',     //如果有子节点，以每条数据的child属性为主
})

// 获取被选中的复选框ID
let checkboxList = ref([])

// 角色ID
let role_id = ref(null);

// 接收父组件传递的数据
const props = defineProps({
    propID: [Object, String, Number]  // 接受对象、字符串或数字
})

// 自定义事件传递子组件的数据
const emits = defineEmits(['update:propID' , 'insert'])

/************************************************************************ */

watch(() => props.propID, (newVal) => {
    // 如果角色ID为空，则执行关闭操作；否则执行启动操作

    newVal == '' ? CloseDialog() : OpenDialog();
})

// 直接调用查询列表接口
getRulesListFn().then((result) => {
    console.log("查询到的数据是：" + result);
    roleData.value = result.data.list;
    // 循环遍历所有菜单数据，只循环第一维度的元素并将其ID返回给defaultRole
    defaultRoles.value = roleData.value.map(item => {
        return item.id
    });
}).catch((error) => {
    console.log(error);
})

// 初始化启动对话框函数
const OpenDialog = () => {
    isDialog.value = true;
    // 局部数据转为全局数据：角色ID
    role_id.value = props.propID.id;
    // 向复选框数组内赋值天极爱当前角色中被选中的数组数据
    checkboxList.value = props.propID.rules.map(item => {
        return item.id
    })

    console.log(checkboxList.value);

    // 如果涉及第三方的UI控件的标签元素操作:添加标签、设置样式、属性修改；最好用过延迟操作并用refDOM元素执行
    setTimeout(() => {
        // 将第三方树形组件的复选框根据数组设置选中效果
        treeref.value.setCheckedKeys(checkboxList.value)
    }, 100)
}

// 初始化关闭对话框函数
const CloseDialog = () => {
    isDialog.value = false;

    emits('update:propID', '')
}

// 确定按钮函数
const handleConfirm = async () => {
    // 获取完整选中的节点
    const checkedKeys = treeref.value.getCheckedKeys();
    let result = await setRolesFn(role_id.value, checkedKeys);
    console.log('保存结果：', result);

    if (result.msg === 'ok' || result.code === 200) {
        ElMessage.success('修改成功');
        emits('insert')
        isDialog.value = false;
        emits('update:propID', '');
    } else {
        ElMessage.error(result.msg || '修改失败');
    }
}
</script>

<style scoped></style>