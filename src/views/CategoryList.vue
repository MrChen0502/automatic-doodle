<template>
    <el-card>
        <el-button type="primary" plain>添加分类</el-button>

        <el-table stripe :data="tableData" v-loading="isLoading"  element-loading-text="正在加载...">
            <el-table-column align="center" type="index" label="序号"/>
            <el-table-column label="分类名称" align="center" prop="name"/>
            <el-table-column label="启用状态" align="center" prop="status"/>
            <el-table-column label="操作" align="center" width="200">
                <template #default="scope">
                    <el-button type="primary">
                        <el-icon>
                            <Edit />
                        </el-icon>
                        编辑
                    </el-button>
                    <el-button type="danger">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

         <!-- 分页 -->
         <div class="pagination">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalCount"
                :page-sizes="[1000, 20000, 5000 , 7000 , 10000]" layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </el-card>
</template>

<script setup>
import { ref , reactive } from 'vue';
import { getGoodsList } from '../api/categorylist';
import { ElMessage } from 'element-plus';


// 数据
// 表格数据，用于存储分类列表
const tableData = ref([])

// 加载状态，控制loading动画显示
const isLoading = ref(false)

// 当前页码，初始值为10（注意：通常应为1）
const currentPage = ref(1) 

// 每页显示条数，默认10条
const pageSize = ref(1000)

// 总数据量，用于分页组件计算总页数
const totalCount = ref(0)

// 查询参数
let queryData = reactive({
    tab: '',                //选项卡的值
    title: '',                 //搜索关键词
    category_id: null,         //商品分类ID
    limit: 10,                 //每页条数，默认每页10条数据
})

const getallcategoryList = async () => {
    isLoading.value = true;
    let result = null;
    try {
        result = await getGoodsList(currentPage.value,queryData);
        console.log(result);
        if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg)

        tableData.value = result.data.cates
        totalCount.value = result.data.totalCount
        console.log(tableData.value);
    } finally {
        isLoading.value = false
    }
}
getallcategoryList();


// 每页条数改变
const handleSizeChange = (val)=>{
    pageSize.value = val
    currentPage.value = 1
    getallcategoryList();
}

//  当前页改变
const handleCurrentChange = ()=>{
    currentPage.value = 1
    getallcategoryList();
}
</script> 
<style scoped>
.el-card {
    height: calc(98vh - 145px);
    margin-top: 15px;

    .el-table{
        height: calc(98vh - 260px);
    }

    .pagination{
        display: flex;
        justify-content: center;
    }
}
</style>