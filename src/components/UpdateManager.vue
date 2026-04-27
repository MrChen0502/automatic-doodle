<template>
    <div class="updatermanager">
        <!-- v-model不允许绑定prop的任何数据，需要通过监听prop来确认绑定的数据结果 -->
        <!-- close-on-click-modal点击遮罩层关闭对话框 -->
        <el-dialog v-model="isDialog" :title="propTitle" width="40%" :close-on-click-modal="false"
            @close="closeChildDiaFn">

            <el-form :model="ModelFormData" ref="RefFormDom" :rules="RuleFormItem" label-width="150px">

                <el-form-item label="管理员用户名" prop="username">
                    <el-input v-model="ModelFormData.username" />
                </el-form-item>

                <el-form-item label="设置登录密码" prop="password" v-if="propTitle === '添加管理员'">
                    <el-input password show-password v-model="ModelFormData.password" />
                </el-form-item>

                <el-form-item label="所属角色" prop="role_id">
                    <el-select v-model="ModelFormData.role_id" placeholder="请选择管理员角色" class="select-width"
                        @change="ChangeRoleFn">
                        <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="上传头像" prop="avatar">
                    <!-- 调用图库管理查询显示的结构 -->
                     <SelectImage v-model="ModelFormData.avatar"/>
                </el-form-item>

                <el-form-item label="账号状态" prop="status" v-show="propTitle === '添加管理员'">
                    <el-switch v-model="ModelFormData.status" :active-value="1" :inactive-value="0" active-text="激活"
                        inactive-text="冻结" inline-prompt style="--el-switch-on-color:#13ce66;"
                        @change="ChageStatusFn" />
                </el-form-item>

            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button type="info" @click="closeChildDiaFn">取消</el-button>
                    <el-button type="success" @click="AddManageFn">确认添加</el-button>
                </span>
            </template>

        </el-dialog>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { EditManager, getaddManager } from '../api/manager'
import { reactive, ref, watch } from 'vue'
import SelectImage from './SelectImage.vue'


let isDialog = ref(false)
let ModelFormData = reactive({
    username: '',
    password: '',
    role_id: '',
    status: '',
    avatar: 0
})          //绑定表单数据
const RefFormDom = ref(null) //绑定表单DOM元素

const emits = defineEmits(['updateChild', 'update:propTitle'])

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
    isDialog.value = newVal == null ? false : true;
    isDialog.value = true;
});
watch(() => props.propItem, (newVal) => {
    console.log(newVal);
    if(newVal != null){
        ModelFormData.username = newVal.username //用户名
    ModelFormData.role_id = newVal.role_id   //所属角色ID
    ModelFormData.avatar = newVal.avatar    //头像
    ModelFormData.status = newVal.status    //头像
    }

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
            let result = await EditManager(props.propItem.id, ModelFormData)
            if (result.msg != 'ok' || !result.data) {
                // 进度条(未添加)

                return ElMessage.error(result.msg)
            }
            ElMessage.success('修改成功')
        }
        // 子组件告知父组件需要重新查询数据
        emits('updateChild')
        // 执行关闭对话框操作
        closeChildDiaFn();
        // 进度条(未添加)

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