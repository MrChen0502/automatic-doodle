<template>
    <div class="updaterole">
        <el-dialog v-model="isDialog" :title="propTitle" width="40%" @close="CloseDialog">
            <el-form :model="formDataModel" ref="formDom" :rule="formRules" label-width="80px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="formDataModel.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <!-- row属性：设置文本域可见行数，超出可见行数范围则显示滚动条 -->
                    <el-input v-model="formDataModel.desc" type="textarea" :row="2"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-switch v-model="formDataModel.status" inline-prompt active-text="使用" inactive-text="禁用"
                        :active-value="1" :inactive-value="0"
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"></el-switch>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="disalog-footer">
                    <el-button type="info" plain @click="CloseDialog">取消</el-button>
                    <el-button color="#1AA094" plain @click="InsertRuleFormfn">确定</el-button>

                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { reactive, ref, watch } from 'vue';
import { InsertRuleFn } from '../api/rules';
import { ElMessage } from 'element-plus';
import { EditRoleFn } from '../api/role';


/************************************************************ */
let isDialog = ref(false);          //对话框的显示隐藏
// 表单数据源对象
let formDataModel = reactive({
    name: '',
    desc: '',
    status: 1,
})
let formDom = ref('');              //表单DOM元素
// 表单验证规则
let formRules = reactive({
    name: [{ required: true, message: '角色名称不允许为空！！！', trigger: 'blur' }],
    desc: [{ required: true, message: '角色描述不允许为空！！！', trigger: 'blur' }]
})

// 编辑角色时的ID
let edit_id = ref('');

// 接收父组件传递过来的数据
const props = defineProps({
    propTitle: String,
    propItem: {
        type: Object,
        default: {}
    }
})

// 子组件自定义绑定事件数据
const emits = defineEmits(['update:propTitle', 'insert']); 
/************************************************************ */
// 启动监听器，监听传递过来的对话框标题propTitle
watch(() => props.propTitle, (newVal) => {
    newVal == null ? CloseDialog() : OpenDialog();
})

// 初始化表单提交函数
const InsertRuleFormfn = async () => {
    // 判断当前表单的验证情况
    formDom.value.validate(async (isVali) => {
        // 任意一项验证未通过，直接终止程序
        if (!isVali) return;

        let result;

        // 判断当前函数执行添加功能还是编辑功能
        switch (props.propTitle) {
            case '添加角色':
                result = await InsertRuleFn(formDataModel);
                console.log(result);

                if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg);
                emits('insert')
                // 执行关闭弹窗操作
                CloseDialog();
                // 通知父组件，重新调用查询函数
                break;

            case '编辑角色':
                result = await EditRoleFn(edit_id.value,formDataModel);
                console.log(result);

                if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg);
                emits('insert')
                // 执行关闭弹窗操作
                CloseDialog();
                // 通知父组件，重新调用查询函数
                break;
        }
    })
}

// 初始化打开对话框
const OpenDialog = () => {
    isDialog.value = true

    // 判断当前函数执行添加功能还是编辑功能
    switch (props.propTitle) {
        case '新增角色':
            formDataModel.name = '';
            formDataModel.desc = '';
            formDataModel.status = 1;
            break;
        case '编辑角色':
            console.log(props.propItem);
            formDataModel.name = props.propItem.name;
            formDataModel.desc = props.propItem.desc;
            formDataModel.status = props.propItem.status;
            edit_id.value = props.propItem.id;
            break;
    }
}

// 初始化关闭对话框
const CloseDialog = () => {
    // 告知父组件对话框标题清空
    emits('update:propTitle', null)
    isDialog.value = false
}
</script>

<style scoped></style>