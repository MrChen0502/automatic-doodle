<template>
    <div class="userlist">
        <UserListSearch :gDatas="userlevel" @searchhand="getseach" />
        <UserListtable :gData="userData" />
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

// 搜索处理函数
const getseach = async (val = {}) => {

    console.log('父组件收到搜索事件！') 
    console.log('接收到的参数：', val)
    let result = await getUserData(val)

    if (result.msg != 'ok' || !result.data) {
        return ElMessage.error(result.msg || '获取数据失败')
    }
    // 赋值数据
    userData.value = result.data.list
    userlevel.value = result.data.user_level
}

//初始化加载数据
getseach()

</script>

<style scoped>
.userlist {
    width: 100%;
    height: 630px;
    overflow: hidden;
    overflow-y: scroll;
    margin-top: 20px;
}
</style>