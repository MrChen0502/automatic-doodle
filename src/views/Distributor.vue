<template>
    <el-card>
        <div class="hander">
            <el-input placeholder="请输入搜索信息">
                <template #append>
                    <el-icon>
                        <Search />
                    </el-icon>
                </template>
            </el-input>
            <el-radio-group v-model="timeRange">
                <el-radio-button label="all" type="primary">全部</el-radio-button>
                <el-radio-button label="today" type="primary">今天</el-radio-button>
                <el-radio-button label="yesterday" type="primary">昨天</el-radio-button>
                <el-radio-button label="week" type="primary">最近7天</el-radio-button>
            </el-radio-group>
        </div>

        <el-table>
            <el-table-column label="头像">

            </el-table-column>
            <el-table-column label="用户信息">

            </el-table-column>
            <el-table-column label="推广数量">

            </el-table-column>
            <el-table-column label="订单数量">

            </el-table-column>
            <el-table-column label="订单金额">

            </el-table-column>
            <el-table-column label="账户佣金">

            </el-table-column>
            <el-table-column label="已提现佣金">

            </el-table-column>
            <el-table-column label="未提现佣金">

            </el-table-column>
            <el-table-column label="操作">

            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalCount"
                :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </el-card>
</template>

<script setup>

</script>

<style scoped>
.el-card {
    margin-top: 20px;
    padding-bottom: 20px; 

    .hander {
        display: flex;
        justify-content: space-between;
        padding: 0;

        .el-input {
            width: 35%;
        }
    }

    .el-table {
        margin-top: 20px;
        border: 1px solid rgb(182, 182, 182);
    }

    .pagination{
        height: calc(100vh - 260px);
    }
}
</style>