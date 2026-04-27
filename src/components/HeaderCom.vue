<template>
    <div class="headercom">
        <!-- 左侧 -->
        <span class="logo">商城后台管理系统</span>
         <!-- 图标 -->
        <el-icon class="foldicon"  @click="setMenus"><Fold /></el-icon>

        <!-- 右侧 -->
        <article>
            <!-- 刷新 -->
             <el-tooltip effect="dark" content="刷新" :enterable="false">
                <el-icon :size="20" class="iconright">
                    <Refresh @click="RefresHandle" />
                </el-icon>
             </el-tooltip>   
            <!-- 全屏 -->
            <el-tooltip effect="dark" content="全屏" :enterable="false">
             <el-icon :size="20" class="iconright">
                <FullScreen @click="toggle" />
            </el-icon>

            </el-tooltip>
            <!-- 登录者信息+下拉菜单 -->
             <!-- @command事件为下拉菜单的点击事件平替,将触发所绑定 -->
             <el-dropdown @command="commandHandle">
                <span>
                    <!-- 头像组件:如视图层直接读取共享数据，可以直接使用$store.state.数据名的形式 -->
                     <el-avatar :size="30" :src="$store.state.userInfo.avatar"></el-avatar>
                     {{ $store.state.userInfo.username }}
                     <!-- 箭头图标 -->
                      <el-icon><CaretBottom  /></el-icon>
                </span>

                <!-- 下拉菜单的菜单区域 -->
                 <template #dropdown>
                        <!-- 菜单项 -->
                         <!-- 使用属性command属性绑定点击事件函数 -->
                         <el-dropdown-item command="editPwd">修改密码</el-dropdown-item>
                         <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                 </template>

             </el-dropdown>
        </article>
    </div>
    <!-- 修改秘密的对话框 -->
     <el-dialog v-model="dialogEditPwd" title="修改密码">
     <!-- 表单组件 -->
      <el-form ref="ruleFormDom" :model="editPwdForm" :rules="ruleForm" label-width="80px">
        <el-form-item label="旧密码" prop="oldpassword">
            <el-input placeholder="请输入原来的密码" v-model="editPwdForm.oldpassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
            <el-input placeholder="请输入新的密码" v-model="editPwdForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="repassword">
            <el-input placeholder="请再次确认新的密码" v-model="editPwdForm.repassword" show-password></el-input>
        </el-form-item>
      </el-form>
      <!-- 将原来的单个按钮修改成两个按钮--使用插槽 -->
     <template #footer>
        <span class="dialogfooter">
            <el-button type="info" @click="EditPwd('cancel')">取消</el-button>
            <el-button type="success" @click="EditPwd('confirm')">确认修改</el-button>
        </span>
     </template>
    </el-dialog>
</template>

<script setup>
import { Fold , Refresh , FullScreen , CaretBottom  } from '@element-plus/icons-vue';
import { reactive } from 'vue';
import { useFullscreen } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
// 导入请求函数
import { editPassword } from '@/api/login';
import { getUserInfoFn } from '@/api/login';
// 导入
import { useStore } from 'vuex';
import { userEditPassword } from '@/utils/UserEditPassword';
// 导入修改密码模块
const {
    dialogEditPwd,
    ruleFormDom,
    editPwdForm,
    ruleForm,
    EditPwd
} = userEditPassword();

const router = useRouter();
// 拿到公共盒子
const store = useStore();

// const UserAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png');
// const UserName = ref('Admin');


// 点击事件：刷新整个页面，刷新整个应用程序
const RefresHandle = ()=>{
    location.reload();
}

const setMenus = ()=>{
    //调用store的mutation函数
    store.commit('updateIsCollapse')
}

// 初始化所有下拉菜单的点击事件函数
const commandHandle = (res) => {
    // 区分下拉菜单的点击事件
    if ( res == 'editPwd' ) {
        // 执行修改密码的相关操作
        dialogEditPwd.value = true;
        // 打开弹窗，清空所有之前留下的数据
        editPwdForm.oldpassword = ''
        editPwdForm.password = ''
        editPwdForm.repassword = ''
        // 打开弹窗，就清空之前的状态(提示、报错)
        if (ruleFormDom.value) {
            ruleFormDom.value.clearValidate()
        }
    }

    if ( res == 'logout' ) {
        ElMessageBox.confirm(
        '确定要退出登录吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        
    // 清除sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('tabsList');
    
    // 清除Vuex 中的用户信息
    // store.commit('clearUserInfo');  // 需要你有这个 mutation
    
    // 跳转登录页
    router.push('/login');
    
    ElMessage.success('已退出登录');
    }).catch(() => {
        // 取消退出登录
        ElMessage.info('已取消退出登录');
    });

    }
}



// 使用全屏功能
const { toggle } = useFullscreen()
</script>

<style scoped lang="less">
.headercom{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    color: white;

    // 嵌套子选择器
    .logo{
        font-size: 26px;
        font-weight: bold;
    }

    .foldicon{
        margin-left: 15px;
        cursor: pointer;

    }

    // 嵌套子标签
    article{
        // 当整体处于弹性盒子中，然后左/右外边距自动将会被视为左/右对齐
        margin-left: auto;
        height: 100%;
        display: flex;
        align-items: center;


        // 嵌套子选择器和标签
        .iconright{
            margin-right: 15px;
            cursor: pointer;

        }

        .el-dropdown{
            color: white;
            cursor: pointer;

            span{
                display: flex;
                align-items: center;

                .el-avatar{
                    margin-left: 15px;
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>