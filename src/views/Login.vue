<template>
    <div class="logincom">
        <el-row class="rows">
            <el-col class="col-left" :lg="16" :md="12" :xs="12" :sm="12">
                <h1>Vite+Vue</h1>
                <p>技术支持:xxx</p>
            </el-col>
            <el-col class="col-right" :lg="8" :md="12" :xs="12" :sm="12">
                <h2>登录</h2>
                <el-form class="loginform" :model="FormObj" ref="registerFormRef" :rules="registerRules" @keyup.enter="AdminIndex(registerFormRef)">
                    <el-form-item prop="username">
                        <el-input placeholder="请输入用户名" v-model="FormObj.username">
                            <template #prefix>
                                <el-icon><User /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input show-password placeholder="请输入密码" v-model="FormObj.password">
                            <template #prefix>
                                <el-icon><Lock /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="loading" @click="AdminIndex(registerFormRef)">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { LoginFn } from '@/api/login';  //  只导入 LoginFn，不需要导入 getUserInfoFn

const routers = useRouter()
const loading = ref(false)
const store = useStore()

let registerFormRef = ref(null)

let FormObj = reactive({
    username: '',
    password: ''
})

const registerRules = reactive({
    username: [
        { required: true, message: '请填写账户', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})

const AdminIndex = (registerFormRef) => {
    console.log('收到的参数:', registerFormRef)
    console.log('有没有 validate 方法:', typeof registerFormRef?.validate)

    if (!registerFormRef) return;
    
    registerFormRef.validate(async (valid) => {
        if (!valid) return;  // 验证失败时返回
        
        try {
            loading.value = true;
            let result = await LoginFn(FormObj);
            
            if (result.errorCode) {
                ElMessage.error(result.msg)
            } else {
                console.log('登录成功:', result.msg);
                
                //  保存 token
                window.sessionStorage.setItem('token', result.data.token);

                
                
                //  调用 Vuex action 获取用户信息和统计数据（只调用一次）
                if (result.data.token) {
                    await store.dispatch('ActionGetUserInfo')
                    console.log('用户信息和统计数据已存储到 Vuex')
                }
                
                // let info = await getUserInfoFn();
                // store.commit('insertUserInfoFn', info.data)
                
                ElMessage.success('登录成功')
                
                //  跳转到首页
                routers.push({ name: 'AdminIndex' })
            }
            console.log(result);
        } catch (error) {
            console.error('登录失败:', error);
            ElMessage.error('登录失败，请稍后重试')
        } finally {
            loading.value = false;
        }
    })
}
</script>

<style scoped>
.logincom {
    width: 100%;
    height: 100%;
}
.rows {
    height: 100%;
}
.col-left {
    height: 99vh;
    background-color: #1AA094;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.col-right {
    height: 99vh;
    background-color: antiquewhite;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.loginform {
    width: 70%;
}
.el-button {
    width: 100%;
    background-color: #1AA094;
}
</style>