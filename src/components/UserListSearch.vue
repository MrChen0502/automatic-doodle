<!-- 搜索添加 -->
<template>
    <!-- Input输入框——复合型输入框 -->
    <div class="userlistsearch">
        <el-input v-model="searches" placeholder="请输入需要搜索的名字" clearable>
            <template #prepend>
                <el-select v-model="searchRegion" placeholder="请选择会员等级" style="width: 150px">
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
        <el-button plain @click="opendialog(1)">新增用户</el-button>
    </div>

    <el-dialog v-model="userlistadd" :title="title">
        <el-form :model="list" :rules="rules" ref="formRef">
            <el-form-item required prop="username" label="用户名字">
                <el-input v-model="list.username" autocomplete="off" placeholder="请输入用户名字" />
            </el-form-item>
            <el-form-item required prop="user_level_id" label="会员等级">
                <el-select v-model="list.user_level_id" placeholder="请选择会员等级" style="width: 150px">
                    <el-option v-for="(item, index) in gDatas" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item required prop="password" label="密码">
                <el-input v-model="list.password" autocomplete="off" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item required prop="nickname" label="昵称">
                <el-input v-model="list.nickname" autocomplete="off" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item required prop="phone" label="电话">
                <el-input v-model="list.phone" autocomplete="off" placeholder="请输入电话" />
            </el-form-item>
            <el-form-item required prop="email" label="邮箱">
                <el-input v-model="list.email" autocomplete="off" placeholder="请输入邮箱" />
            </el-form-item> -->
            <el-form-item required prop="status" label="状态">
                <el-switch v-model="list.status" autocomplete="off" placeholder="请选择状态(0,1)" />
            </el-form-item>
            <!-- Upload上传器 -->
            <el-form-item label="头像" prop="avatar">
                <!-- 调用图库管理查询显示的结构 -->
                <SelectImage v-model="list.avatar" />
            </el-form-item>

        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="userlistadd = false"">取消</el-button>
                <!-- :disabled=" isDisabled" -->
                    <el-button type="primary" @click="submitForm">
                        确认
                    </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 上传图片对话框 -->
    <!-- <el-dialog v-model="uploadData.diaUpload" title="上传图片" width="40%">
        <p>
            当前图库分类ID:{{ queryData.id }}
        </p>
        <UploadCom :data="{ image_class_id: queryData.id }" @uploadadd="uploadaddsuccess" />
    </el-dialog> -->
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { postUserData } from '@/api/user';
import SelectImage from './SelectImage.vue';

const searches = ref('')
const searchRegion = ref('')
const userlistadd = ref(false)
const formRef = ref(null)

let title = ref('添加用户')

const emits = defineEmits(['searchhand']);

// 接收父组件数据的变量
const props = defineProps({
    gDatas: Array,
})

const list = reactive({
    username: '',
    // password: '',
    user_level_id: '',
    // nickname: '',
    // phone: '',
    // email: '',
    avatar: '',
    status: 1
})

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    region: [
        { required: true, message: '请选择会员等级', trigger: 'change' }
    ],
    avatar: [
        { required: true, message: '请上传头像', trigger: 'change' }
    ]
}

const handleFileChange = (file, fileList) => {
    // 验证是否是图片
    if (!file.raw.type.startsWith('image/')) {
        ElMessage.error('只能上传图片文件！')
        return
    }
}

// 获取当前时间的格式化函数
const getCurrentTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 提交表单
const submitForm = async () => {
    // 手动检查必填项
    if (!list.username) {
        ElMessage.warning('请输入用户名')
        return
    }


    const currentTime = getCurrentTime()

    const submitData = {
        username: list.username,
        password: list.password,
        user_level_id: list.user_level_id,
        nickname: list.nickname,
        phone: list.phone,
        email: list.email,
        avatar: list.avatar,
        status: list.status
    }

    console.log('提交的数据：', submitData)

    const result = await postUserData(submitData)

    ElMessage.success('添加成功')
    userlistadd.value = false

    // 清空表单
    list.username = ''
    // list.password = ''
    list.user_level_id = ''
    // list.nickname = ''
    // list.phone = ''
    // list.email = ''
    list.avatar = ''
    list.status = ''
}


// 搜索功能
const handlesearch = () => {
    // 构建搜索参数
    const val = {
        keyword: searches.value,        // 搜索关键词（用户名）
        user_level_id: searchRegion.value || '',  // 会员等级ID
    }

    // 触发父组件的搜索事件
    emits('searchhand', val)
}

// 重置表单
const resetForm = () => {
    list.username = ''
    // list.password = ''
    list.user_level_id = ''
    // list.nickname = ''
    // list.phone = ''
    // list.email = ''
    list.avatar = ''
    list.status = 1

    // 清除表单
    if (formRef.value) {
        formRef.value.resetFields()
    }
}
// 打开弹窗
const opendialog = (type, item = {}) => {
    userlistadd.value = true

    switch (type) {
        case 1:
            // 添加管理员
            title.value = '添加用户'
            list.value = {}  // 添加时清空
            break;
        case 2:
            // 编辑管理员
            title.value = '编辑用户'
            list.value = { ...item }  // 保存当前行数据
            break;
    }
}



watch(searches, (newVal) => {
    // 清空搜索框，返回所有数据
    if (newVal == '') {
        searchRegion.value = ''
        const val = {
            keyword: '',
            user_level_id: searches.value || '',
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
</script>

<style scoped>
.userlistsearch {
    width: 400px;
    margin-top: 20px;
    margin-left: 20px;
}

.avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: cover;
}
</style>