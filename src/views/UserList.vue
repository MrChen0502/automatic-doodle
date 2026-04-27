<template>
    <div class="userlist">
        <UserListSearch :gDatas="userlevel"/>
        <UserListtable :gData="userData"/>
    </div>
</template>

<script setup>
import UserListSearch from '@/components/UserListSearch.vue';
import UserListtable from '@/components/UserListtable.vue';
import { getUserData , postUserData } from '@/api/user';
import { ref } from 'vue';

let userData = ref([])
let userlevel = ref([])

getUserData().then( result =>{
    if( result.msg != 'ok' || !result.msg )return

    // 赋值数据
    userData.value = result.data.list
    userlevel.value = result.data.user_level

    console.log(userData.value);
console.log(userlevel.value)
} )
;

</script>

<style scoped>
.userlist{
    width: 100%;
    height: 630px;
    overflow: hidden;
    overflow-y: scroll;
    margin-top: 20px;
}
</style>