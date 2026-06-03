<template>
    <div>
        <el-card>
            <el-input placeholder="请输入商品名称" class="comment_input" v-model="searchTitle" clearable>
                <template #append>
                    <el-button @click="handSearch">
                        <el-icon>
                            <Search />
                        </el-icon>
                    </el-button>
                </template>
            </el-input>


            <el-table :data="commentList" v-loading="isLoading" element-loading-text="正在加载数据...">
                <el-table-column type="expand" @click.stop>
                    <template #default="scope">
                        <div v-if="scope.row.status == 1">
                            <span style="font-weight: bold;">用户评论:{{ scope.row?.review?.data }}</span><br />
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span>用户上传的图片分享：</span>
                                <el-image :src="scope.row?.review?.image[0]"
                                    style="width: 50px; height: 50px; cursor: pointer;" fit="cover" />
                            </div>
                            <div>用户购买的时间: {{ scope.row?.review_time }}</div>
                        </div>
                        <div style="color: #999; padding: 10px;" v-else>
                            该评论已隐藏
                        </div>
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
                        <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" />
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
import { ref , watch } from 'vue';
import { getproductreviews } from '../api/comment';
import { ElMessage } from 'element-plus';

// 数据
// const loading = ref(false)
// 评论列表数据（存储后端返回的所有评论）
const commentList = ref([])

// 总记录数（用于分页组件计算总页数）
const totalCount = ref(0)

// 当前页码（默认从第1页开始）
const currentPage = ref(1)

// 每页显示条数（默认每页10条）
const pageSize = ref(10)

// 搜索关键词（用户输入的商品名称）
const searchTitle = ref('')

// 加载动画效果
let isLoading = ref(false)

// 监听搜索关键词变化
watch(searchTitle, (newVal) => {
    if (newVal === '') {
        // 搜索框清空时，重置页码并重新加载全部数据
        currentPage.value = 1;
        getproduct();
    }
})

const getproduct = async () => {
    // loading.value = true;
    isLoading.value = true;
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

/**
 * 分页查询 - 处理页码改变
 * @param {number} val - 新的页码值（从el-pagination组件传入）
 * 
 * 功能说明：
 * 1. 当用户点击分页器的页码按钮时触发
 * 2. 更新当前页码为点击的页码
 * 3. 重新调用getproduct()获取对应页码的数据
 */
const handleCurrentChange = (val) => {
    currentPage.value = val;  // 更新当前页码
    getproduct();             // 重新获取数据
}

/**
 * 分页查询 - 处理每页显示条数改变
 * @param {number} val - 新的每页显示条数值（从el-pagination组件传入）
 * 
 * 功能说明：
 * 1. 当用户切换每页显示条数（如从10条切换到20条）时触发
 * 2. 更新每页显示条数
 * 3. 重新调用getproduct()获取数据
 * 
 * 注意：
 * - 切换每页条数后，页码会自动重置为第1页（el-pagination组件默认行为）
 * - 不需要手动重置currentPage，因为el-pagination会自动处理
 */
const handleSizeChange = (val) => {
    pageSize.value = val;     // 更新每页显示条数
    getproduct();             // 重新获取数据
}

// 搜索商品
const handSearch =()=>{
    currentPage.value = 1
    getproduct();
}
</script>

<style scoped>
.el-card {
    margin-top: 20px;

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