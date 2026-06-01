<template>
    <div>
        <el-card>
            <el-input placeholder="请输入商品名称" class="comment_input">
                <template #append>
                    <el-button @click="handleSearch">
                        <el-icon>
                            <Search />
                        </el-icon>
                    </el-button>
                </template>
            </el-input>


            <el-table>
                <el-table-column label="商品">

                </el-table-column>
                <el-table-column label="评分">

                </el-table-column>
                <el-table-column label="评价时间">

                </el-table-column>
                <el-table-column label="是否显示">

                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalCount"
                    :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getproductreviews } from '../api/comment';

// 数据
const loading = ref(false)
const commentList = ref([])
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchTitle = ref('')

let isLoading = ref(false)

const getproduct = async () => {
    loading.value = true;

    let result = await getproductreviews(currentPage.value, searchTitle.value)
    console.log("打印订单评论数据：", result);

    try {
        if (result.msg != 'ok' || !result.data) {
            commentList.value = result.data.list            //表格用
            totalCount.value = result.data.totalCount       //分页用
        }
    } finally {
        isLoading.value = false;
    }

}
getproduct();

</script>

<style scoped>
.el-card {
    .comment_input {
        width: 30%;
    }

    .pagination {
        display: flex;
        justify-content: center;
    }
}
</style>