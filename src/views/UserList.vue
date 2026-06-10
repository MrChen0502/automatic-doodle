<template>
    <div class="userlist">
        <el-card>
            <UserListSearch ref="userSearchRef" :gDatas="userlevel" @searchhand="getseach" />
            <UserListtable :gData="userData" :totalCount="totalCount"  @deleteuser="getseach"  @editUser="handleEditUser" :isLoading="isLoading"/>
        </el-card>

    </div>
</template>

<script setup>
import UserListSearch from '@/components/UserListSearch.vue';
import UserListtable from '@/components/UserListtable.vue';
import { getUserData, postUserData } from '@/api/user';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

let userData = ref([])
let userlevel = ref([])
const userSearchRef = ref(null)
let totalCount = ref(0)  // 定义总条数
let isLoading = ref(false)

// 处理编辑
const handleEditUser = (user) => {
    // 调用子组件的 openDialog 方法打开编辑弹窗
    userSearchRef.value.openDialog(2, user)
}

// 搜索处理函数
const getseach = async (val = {}) => {
    isLoading.value = true 
    try {
        console.log('父组件收到搜索事件！') 
        let result = await getUserData(val)
        if (result.msg != 'ok' || !result.data) {
            return ElMessage.error(result.msg || '获取数据失败')
        }
        userData.value = result.data.list
        userlevel.value = result.data.user_level
        totalCount.value = result.data.totalCount
    } finally {
        isLoading.value = false
    }
}

//初始化加载数据
getseach()

</script>

<style scoped>
.el-card{
    margin-top: 15px;
    height: 98vh;
}
</style>