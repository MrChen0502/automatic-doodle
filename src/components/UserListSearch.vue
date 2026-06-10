<!-- 搜索添加 -->
<template>
    <!-- Input输入框——复合型输入框 -->
    <div class="flexclass">
        <div class="userlistsearch">
            <el-input v-model="searches" placeholder="请输入需要搜索的名字" clearable>
                <template #prepend>
                    <el-select v-model="searchRegion" placeholder="请选择会员等级" style="width: 150px" clearable>
                        <el-option v-for="(item, index) in gDatas" :key="index" :label="item.name" :value="item.id" />
                    </el-select>
                </template>
                <template #append>
                    <el-button :icon="Search" @click="handlesearch" />
                </template>
            </el-input>
        </div>

        <!-- Dialog对话框——自定义内容 -->
        <div class="userlistadd">
            <el-button plain @click="openDialog(1)" type="primary" style="width: 100px;">新增用户</el-button>
        </div>
    </div>


    <!-- 添加/编辑共用的弹窗 -->
    <el-dialog v-model="userlistadd" :title="title" @close="resetForm">
        <el-form :model="list" :rules="rules" ref="formRef">
            <el-form-item required prop="username" label="用户名字">
                <el-input v-model="list.username" autocomplete="off" placeholder="请输入用户名字" />
            </el-form-item>
            <el-form-item required prop="phone" label="用户手机号">
                <el-input v-model="list.phone" autocomplete="off" placeholder="请输入用户手机号" />
            </el-form-item>
            <el-form-item required prop="email" label="用户邮箱">
                <el-input v-model="list.email" autocomplete="off" placeholder="请输入用户邮箱" />
            </el-form-item>

            <!-- 编辑时可以选择不修改密码 -->
            <el-form-item :required="title === '添加用户'" prop="password" label="密码">
                <el-input v-model="list.password" autocomplete="off"
                    :placeholder="title === '编辑用户' ? '不修改请留空' : '请输入密码'" show-password />
            </el-form-item>

            <el-form-item required prop="user_level_id" label="会员等级">
                <el-select v-model="list.user_level_id" placeholder="请选择会员等级" style="width: 150px">
                    <el-option v-for="(item, index) in gDatas" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item required prop="status" label="状态">
                <el-switch v-model="list.status" :active-value="1" :inactive-value="0" active-text="启用"
                    inactive-text="禁用" />
            </el-form-item>

            <!-- 头像上传 -->
            <el-form-item label="头像" prop="avatar">
                <SelectImage v-model="list.avatar" />
                <!-- 显示已选择的头像预览 -->
            </el-form-item>

        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="userlistadd = false">取消</el-button>
                <el-button type="primary" @click="submitForm">
                    确认{{ title === '添加用户' ? '添加' : '修改' }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { postUserData, updateUserData } from '@/api/user';  // 导入编辑API
import SelectImage from './SelectImage.vue';

const searches = ref('')
const searchRegion = ref('')
const userlistadd = ref(false)
const formRef = ref(null)


// 添加状态管理
let title = ref('添加用户')
let editId = ref(null)  // 编辑时的用户ID

const emits = defineEmits(['searchhand']);

// 接收父组件数据的变量
const props = defineProps({
    gDatas: Array,
    isLoading: Boolean

})

// 表单数据
const list = reactive({
    username: '',
    password: '',
    user_level_id: '',
    phone: '',
    email: '',
    avatar: '',
    status: 1
})

// 表单验证规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    user_level_id: [
        { required: true, message: '请选择会员等级', trigger: 'change' }
    ]
}

// 提交表单
const submitForm = async () => {
    // 表单验证
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
        if (!valid) return

        // 手动检查必填项
        if (!list.username) {
            ElMessage.warning('请输入用户名')
            return
        }

        try {
            let result;
            if (title.value === '添加用户') {
                // 添加用户
                if (!list.password) {
                    ElMessage.warning('请输入密码')
                    return
                }

                const submitData = {
                    username: list.username,
                    password: list.password,
                    user_level_id: list.user_level_id,
                    phone: list.phone,
                    email: list.email,
                    avatar: list.avatar,
                    status: list.status
                }

                console.log('添加用户数据：', submitData)
                result = await postUserData(submitData)


            } else {
                // 编辑用户
                const submitData = {
                    username: list.username,
                    user_level_id: list.user_level_id,
                    phone: list.phone,
                    email: list.email,
                    avatar: list.avatar,
                    status: list.status
                }

                // 只有修改了密码才传递密码字段
                if (list.password) {
                    submitData.password = list.password
                }

                console.log('编辑用户数据：', submitData)
                result = await updateUserData(editId.value, submitData)

            }

            // 处理返回结果
            if (result.msg === 'ok' || result.code === 20000) {
                ElMessage.success(title.value === '添加用户' ? '添加成功' : '修改成功')
                emits('searchhand')  // 通知父组件刷新列表
                userlistadd.value = false  // 关闭弹窗
            } else {
                ElMessage.error(result.msg || '操作失败')
            }

        } catch (error) {
            console.error('提交失败:', error)
            ElMessage.error('操作失败，请重试')
        }
    })
}

// 搜索功能
const handlesearch = () => {
    const val = {
        keyword: searches.value || '',
        user_level_id: searchRegion.value || '',
    }
    emits('searchhand', val)
}

// 重置表单
const resetForm = () => {
    list.username = ''
    list.password = ''
    list.user_level_id = ''
    list.phone = ''
    list.email = ''
    list.avatar = ''
    list.status = 1
    editId.value = null

    // 清除表单验证
    if (formRef.value) {
        formRef.value.resetFields()
    }
}

// 打开弹窗（添加或编辑）
const openDialog = (type, item = null) => {
    resetForm()  // 先重置表单

    switch (type) {
        case 1:
            // 添加用户
            title.value = '添加用户'
            editId.value = null
            break;
        case 2:
            // 编辑用户
            if (item) {
                title.value = '编辑用户'
                editId.value = item.id
                // 填充表单数据
                list.username = item.username
                list.user_level_id = item.user_level_id
                list.phone = item.phone || ''
                list.email = item.email || ''
                list.avatar = item.avatar || ''
                list.status = item.status
                list.password = ''
            }
            break;
    }

    userlistadd.value = true
}

// 搜索
watch(searches, (newVal) => {
    if (newVal == '') {
        searchRegion.value = ''
        const val = {
            keyword: '',
            user_level_id: '',
        }
        emits('searchhand', val)
    }
})
// 监听会员等级
watch(searchRegion, (newVal) => {
    // 当清空会员等级时
    if (!newVal) {
        // 会员等级被清空，回退
        const val = {
            keyword: searches.value || '',
            user_level_id: '',
        }
        emits('searchhand', val)
    } else if (newVal) {
        // 选择了会员等级，立即搜索
        const val = {
            keyword: searches.value || '',
            user_level_id: newVal,
        }
        emits('searchhand', val)
    }
})

// 监听对话框关闭，自动重置表单
watch(userlistadd, (newVal) => {
    if (!newVal) {
        resetForm()
    }
})

// 暴露方法给父组件调用
defineExpose({
    openDialog
})
</script>

<style scoped>
.flexclass {
    display: flex;

    .userlistadd {
        margin-left: 2%;
    }
}

.userlistsearch {
    width: 50%;
}
</style>