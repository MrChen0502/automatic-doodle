<template>
    <el-dialog v-model="isDialogRules" :title="propTitle" width="50%" @close="CloseDialog">
        <el-form label-width="100px">
            <el-form-item label="上级菜单" v-if="propTitle == '新增'">
                <el-cascader placeholder="商品管理/分类管理" :show-all-levels="false" v-model="form.rule_id" :options="menuList"
                    :props="cascaderProps" clearable></el-cascader>
            </el-form-item>
            <el-form-item label="菜单/规则" v-if="propTitle == '新增'">
                <el-radio-group v-model="form.menu">
                    <el-radio :value="1" size="large" border>菜单</el-radio>
                    <el-radio :value="0" size="large" border>权限</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="名称">
                <el-input placeholder="请输入名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" v-if="form.menu == 1">
                <IconSelect v-model:propicon="form.icon" />
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="form.order" @change="ChangeOrderFn"></el-input-number>
            </el-form-item>
            <el-form-item label="后端规则" v-if="form.menu == 0">
                <el-input v-model="form.condition"></el-input>
            </el-form-item>
            <el-form-item label="请求方式" v-if="form.menu == 0">
                <el-select v-model="form.method" placeholder="请选择请求方式">
                    <el-option v-for="item in methodData" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
            </el-form-item>
            <el-form-item label="前端路由" v-if="form.menu == 1 && form.rule_id > 0">
                <el-input v-model="form.frontpath"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="form.status" :active-value="1" :inactive-value="0" inactive-text="禁用"
                    active-text="启用" inline-prompt @change="ChangeStatusFn" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="info" @click="CloseDialog">取消</el-button>
                <el-button type="primary" @click="InsertRulesFn">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { InsertRuleFn, updateRuleFn } from '@/api/rules';
import { ElMessage } from 'element-plus';
import IconSelect from './IconSelect.vue';


/*************************************************** */
let isDialogRules = ref(false);


// 接收父组件的数据
const props = defineProps({
    propTitle: String,
    menuList: {            // 新增这个
        type: Array,
        default: () => []
    },
    propItem: {
        type: Object,
        default: {}
    }
})

// 级联选择器配置
const cascaderProps = reactive({
    value: 'id',
    label: 'name',
    children: 'child',    // 匹配你的数据
    checkStrictly: true,  // 可以选任意一级
    emitPath: false       // 只返回选中那级的 id
})

const form = reactive({
    rule_id: 0,    // 上级菜单 id 
    status: 0,        //状态
    name: '',          // 权限名称 
    menu: 1,           // 类型 1菜单 0权限
    icon: '',          // 图标
    frontpath: '',     // 路由地址 
    order: 50,          // 排序 
    method: '',     // 请求方式 
    condition: ''           // 描述 
})

// 请求方式数据
const methodData = ref([
    { id: 1, name: 'GET' },
    { id: 2, name: 'POST' },
    { id: 3, name: 'PUT' },
    { id: 4, name: 'DELETE' }
])
/*************************************************** */
// 定义emits
const emits = defineEmits(['update:propTitle', 'submitok'])

/*************************************************** */


// 启动监听器：检测propTitle的值
watch(() => props.propTitle, (newVal) => {
    // 判断是否有标题传入，如果有，打开对话框；如果没有关闭对话框
    if (newVal == '' || newVal == null) {
        CloseDialog();
    } else {
        openDialog();
    }
})
/*************************************************** */

// 检测propItem的值
watch(() => props.propItem, (newVal) => {
    console.log(newVal);
    if (newVal != null) {
        form.name = newVal.name;
        form.icon = newVal.icon;
        form.status = newVal.status;
        form.order = newVal.order;
    }
})

/*************************************************** */

// 数字输入框：排序改变事件
const ChangeOrderFn = (val) => {
    form.order = val;
}
// Switch改变事件
const ChangeStatusFn = (val) => {
    form.status = val;
}

const InsertRulesFn = async () => {
    let result ;
    switch (props.propTitle) {
        case '新增':
            // 请求数据
            result = await InsertRuleFn(form)
            console.log(result);

            if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg);

            // 关闭对话框
            CloseDialog();
            // 自定义事件：告知父组件添加成功，重新查询数据
            emits('submitok')
            break;
        case '编辑':
            // 请求数据
            result = await updateRuleFn(props.propItem.id, form)
            console.log(result);

            if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg);
            // 关闭对话框
            CloseDialog();
            // 自定义事件：告知父组件添加成功，重新查询数据
            emits('submitok')
            break;
    }
}

// 启动对话框:对上一次的表单数据进行清理
const openDialog = () => {
    // switch判断：添加==>清空上一次的数据；编辑==>将当前数据赋值表单
    switch (props.propTitle) {
        case '新增':
            form.rule_id = 0;    // 上级菜单 id 
            form.status = 0;       //状态
            form.name = '';          // 权限名称 
            form.menu = 1;          // 类型 1菜单 0权限
            form.icon = '';          // 图标
            form.frontpath = '';     // 路由地址 
            form.order = 50;          // 排序 
            form.method = '';     // 请求方式 
            form.condition = '';           // 描述 
            break;
        case '编辑':
            break;
    }
    isDialogRules.value = true;
}


//关闭对话框
const CloseDialog = () => {
    isDialogRules.value = false;
    // 修改父组件传递过来的数据
    emits('update:propTitle', '')
}
</script>

<style scoped></style>