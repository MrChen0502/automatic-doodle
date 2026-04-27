<template>
    <div class="updatemanager">
        <!-- v-model不允许绑定prop的任何数据，需要通过监听prop来确认绑定的数据结果 -->
        <el-dialog v-model="isDialog" :title="propTitle" width="40%" :close-on-click-model="false"
            @close="closeChildDiaFn">
            <el-form :model="ModelFormData" ref="RefFormDom" :rules="RuleFormItem" label-width="150px">
                <el-form-item label="管理员用户名" prop="username">
                    <el-input v-model="ModelFormData.username" />
                </el-form-item>
                <el-form-item label="登录密码" prop="password">
                    <el-input v-model="ModelFormData.password" />
                </el-form-item>
                <el-form-item label="用户ID" prop="role_id">
                    <el-select v-model="ModelFormData.role_id" placeholder="请选择管理员角色" @close="ChangeRoleFn">
                        <el-option v-for="item in roleList" key="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="管理员状态" prop="status">
                    <el-switch  v-model="ModelFormData.status" />
                </el-form-item>
                <el-form-item label="管理员头像" prop="avatar">
                    <el-input v-model="ModelFormData.avatar" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="info" @click="closeChildDiaFn">取消</el-button>
                <el-button type="primary" @click="AddManageFn">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { EditManager , getaddManager } from '../api/manager'
import { reactive, ref, watch } from 'vue'


let isDialog = ref(false)
let ModelFormData = reactive({
    username: '',
    password: '',
    role_id: '',
    status: '',
    avatar: 0
})          //绑定表单数据
const RefFormDom = ref(null) //绑定表单DOM元素

const emits = defineEmits(['updateChild' , 'update:propTitle'])

// 表单验证规则
const RuleFormItem = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    role_id: [
        { required: true, message: "请输入角色ID", trigger: 'blur' }
    ],
    status: [
        { required: true, message: "请选择状态", trigger: 'blur' }
    ],
})
let roleList = ref([])    //角色列表

// 接收父组件传递过来的数据(不能直接在子组件内更新父组件传过来的数据，只读不更新)
const props = defineProps({
    propTitle: {
        type: String,
        default: '添加管理员'
    },
    roleList: {
        type: Array,
        default: []
    },
    //接受父组件传递过来的当前一行的数据
    propItem: {
        type: Object,
        default: {}
    }
})
/********************************************************* */
// 启动监听器
watch(() => props.propTitle, (newVal) => {
    console.log(newVal);
    //只有当标题发生改变时对话框才会生效，因此在关闭对弹窗时需要清空标题以免上一次与当前操作的标题一致而无法打开弹窗
    isDialog.value = newVal = null ? false : true;
    isDialog.value = true;
});
watch(() => props.propItem , (newVal) =>{
    console.log(newVal);
    //关闭对话框清空表单
    ModelFormData.username = newVal.username //用户名
    ModelFormData.role_id = newVal.role_id   //所属角色ID
    ModelFormData.avatar = newVal.avatar    //头像
    ModelFormData.status = newVal.status    //头像
})

// 初始化修改管理员状态函数
const ChageStatusFn = (e) => {
    console.log(e);
    ModelFormData.status = e;
}

// 初始化添加管理员函数
const AddManageFn = () => {
    // 验证表单结果
    RefFormDom.value.validate(async (vali) => {
        if (!vali) return;

        if (props.propTitle == '添加管理员') {
            let result = await getaddManager(ModelFormData)
            console.log(result);

            if (result.msg != 'ok' || !result.data) {
                return ElMessage.error(result.msg)
            }
            // 添加成功提示
            ElMessage.success('添加成功！！！')
            // 子组件告知父组件需要重新查询数据
            emits('updateChild')
            // 执行关闭对话框
            closeChildDiaFn()
        } else if (props.propTitle == '编辑管理员') {

        }
    })
}

// 初始化选择管理员角色函数
const ChangeRoleFn = (e) => {
    console.log(e);
    ModelFormData.role_id = e;
}

// 初始化关闭函数
const closeChildDiaFn = () => {
    ModelFormData.username = '',
        ModelFormData.password = '',
        ModelFormData.role_id = '',
        ModelFormData.avatar = '',
        ModelFormData.status = 0
    isDialog.value = false;
    // 每次关闭对话框
    emits('update:propTitle', null)
}
</script>

<style></style>