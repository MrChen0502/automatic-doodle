<!-- 搜索添加 -->
<template>
    <!-- Input输入框——复合型输入框 -->
    <div class="userlistsearch">
        <el-input v-model="searches" placeholder="请输入需要搜索的名字">
            <template #prepend>
                <el-select v-model="searchRegion" placeholder="请选择会员等级" style="width: 150px">
                    <el-option v-for="(item, index) in gDatas" :key="index" :label="item.name" :value="index" />
                </el-select>
            </template>
            <template #append>
                <el-button :icon="Search" />
            </template>
        </el-input>
    </div>

    <!-- Dialog对话框——自定义内容 -->
    <div class="userlistadd">
        <el-button plain @click="userlistadd = true">新增用户</el-button>
    </div>

    <el-dialog v-model="userlistadd" title="添加用户">
        <el-form :model="list" :rules="rules" ref="formRef">
            <el-form-item required prop="username">
                <el-input v-model="list.username" autocomplete="off" placeholder="请输入用户名字" />
            </el-form-item>
            <el-form-item required prop="user_level_id">
                <el-select v-model="list.user_level_id" placeholder="请选择会员等级" style="width: 150px">
                    <el-option v-for="(item, index) in gDatas" :key="index" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item required prop="password">
                <el-input v-model="list.password" autocomplete="off" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item required prop="nickname">
                <el-input v-model="list.nickname" autocomplete="off" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item required prop="phone">
                <el-input v-model="list.phone" autocomplete="off" placeholder="请输入电话" />
            </el-form-item>
            <el-form-item required prop="email">
                <el-input v-model="list.email" autocomplete="off" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item required prop="status">
                <el-input v-model="list.status" autocomplete="off" placeholder="请输入启用状态(0,1)" />
            </el-form-item>
            <!-- Upload上传器 -->
            <el-form-item required prop="avatar">
                <el-upload class="Imlurl" :show-file-list="false" :on-change="handleFileChange" :auto-upload="false"
                    v-model="list.avatar">
                    <img v-if="list.avatar" :src="list.avatar" class="avatar" />
                    <el-icon v-else>
                        <Plus />
                    </el-icon>
                </el-upload>
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


</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { postUserData } from '@/api/user';

const searches = ref('')
const searchRegion = ref('')
const userlistadd = ref(false)
const formRef = ref(null)

// 接收父组件数据的变量
const props = defineProps({
    gDatas: Array,
})

const list = reactive({
    username: '',
    password: '',
    user_level_id: '',
    nickname: '',
    phone: '',
    email: '',
    avatar: '',
    status: ''
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

    console.log('提交的数据：',submitData)

    const result = await postUserData(submitData)

    ElMessage.success('添加成功')
    userlistadd.value = false

    // 清空表单
    list.username = ''
    list.password = ''
    list.user_level_id = ''
    list.nickname = ''
    list.phone = ''
    list.email = ''
    list.avatar = ''
    list.status = ''
}
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