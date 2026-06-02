<template>
    <div>
        <el-card>
            <el-input placeholder="请输入商品名称" class="comment_input">
                <template #append>
                    <el-button >
                        <el-icon>
                            <Search />
                        </el-icon>
                    </el-button>
                </template>
            </el-input>


            <el-table :data="commentList">
                <el-table-column type="expand">
                    <template #default="scope">
                        <span style="font-weight: bold;">用户评论:{{ scope.row?.review?.data }}</span><br />
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span>用户上传的图片分享：</span>
                            <el-image :src="scope.row?.review?.image[0]" style="width: 50px; height: 50px; cursor: pointer;"
                                fit="cover" />
                        </div>
                        <div>用户购买的时间: {{ scope.row?.review_time }}</div>
                        
                    </template>
                </el-table-column>
                <el-table-column label="商品" align="center">
                    <template #default="scope">
                        <div class="shops">
                            <el-image :src="scope.row?.goods_item?.cover" />
                            <span>{{ scope.row?.goods_item?.title }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="评分" align="center">
                    <template #default="scope">
                        <span>用户: {{ scope.row?.user?.username }}</span>
                        <!-- el-rate -->
                        <div>
                            <el-rate v-model="scope.row.rating" disabled show-score />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="评价时间" align="center" prop="review_time" />
                <el-table-column label="是否显示" align="center">
                    <template #default="scope">
                        <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" </el-switch>
                    </template>
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
import { ElMessage } from 'element-plus';

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
        if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg)
        commentList.value = result.data.list            //表格用
        totalCount.value = result.data.totalCount       //分页用
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
        margin-top: 20px;
    }

    .el-table {
        height: calc(100vh - 260px);

        .shops {
            display: flex;
            justify-content: center;

            .el-image {
                width: 60px;
                margin-right: 20px;
            }

            span {
                display: flex;
                align-items: center;
            }

            .el-rate {
                display: flex;
                align-items: center;
                cursor: default !important;
            }
        }
    }
}
</style>