<template>
    <el-card>
        <el-button type="primary" @click="dialogVisible = true">新增公告</el-button>
        <el-table strpie :data="tableData" v-loading="isLoading">
            <el-table-column label="公告ID" prop="id" align="center">

            </el-table-column>
            <el-table-column label="公告标题" prop="title" align="center">

            </el-table-column>
            <el-table-column label="公告内容" prop="content" align="center">

            </el-table-column>
            <el-table-column label="排序权重（数字越小越靠前）" prop="order" align="center">

            </el-table-column>
            <el-table-column label="创建时间" prop="create_time" align="center" width="240">

            </el-table-column>
            <el-table-column label="更新时间" prop="update_time" align="center" width="240">

            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalCount"
                :page-sizes="[10, 20, 50, 70, 100]" layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { allnotice } from '../api/notice';
import { ElMessage } from 'element-plus';



let currentPage = ref(1)
let pageSize = ref(10)  // 改为数字 10，而不是空字符串
let totalCount = ref(0)

let tableData = ref([])

let dialogVisible = ref(false)
let isLoading = ref(false)

const getnoticeList = async () => {
    isLoading.value = true;
    let result = null;
    try {
        result = await allnotice(currentPage.value)
        if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg)

        tableData.value = result.data.list
        totalCount.value = result.data.totalCount
    } finally {
        isLoading.value = false;
    }
}
getnoticeList();


const handleSizeChange = (val)=>{
    pageSize.value = val
    currentPage.value = 1
    getnoticeList();
}

const handleCurrentChange = ()=>{
    currentPage.value = 1
    getnoticeList();
}
</script>

<style>
.el-card {
    height: 98vh;
    margin-top: 15px;

    .el-table {
        height: calc(98vh - 260px);
        margin-top: 15px;
        border: 1px solid rgb(209, 209, 209);
    }

    .pagination {
        display: flex;
        justify-content: center;
        margin-top: 15px;
    }
}
</style>