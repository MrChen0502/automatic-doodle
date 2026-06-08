<template>
    <el-card>
        <div class="hander">
            <el-input placeholder="请输入搜索信息" v-model="keyName" clearable >
                <template #append>
                    <el-button @click="handSearch">
                        <el-icon>
                            <Search />
                        </el-icon>
                    </el-button>
                </template>
            </el-input>
            <el-radio-group v-model="timeRange" @change="handleTimeChange">
                <el-radio-button label="all" type="primary">全部</el-radio-button>
                <el-radio-button label="today" type="primary">今天</el-radio-button>
                <el-radio-button label="yesterday" type="primary">昨天</el-radio-button>
                <el-radio-button label="week" type="primary">最近7天</el-radio-button>
            </el-radio-group>
        </div>

        <el-table :data="tableData" v-loading="isLoading" style="border: 1px;">
            <el-table-column label="头像" align="center">
                <template #default="scope">
                    <el-image :src="scope.row.avatar" fit="cover">
                        <!-- 图片加载失败时显示默认头像 -->
                        <template #error>
                            <el-image :src="defaultAvatar" fit="cover" />
                        </template>
                    </el-image>

                </template>
            </el-table-column>
            <el-table-column label="用户信息" align="center">
                <template #default="scope">
                    <div class="Information">
                        用户：<span>{{ scope.row.username }}</span><br />
                        电话：<span>{{ scope.row.phone }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="推广数量" align="center">
                <template #default="scope">
                    <span>{{ scope.row.share_num }}</span>
                </template>
            </el-table-column>
            <el-table-column label="订单数量" align="center">
                <template #default="scope">
                    <span>{{ scope.row.share_order_num }}</span>
                </template>
            </el-table-column>
            <el-table-column label="订单金额" align="center">
                <template #default="scope">
                    <span>{{ scope.row.order_price }}</span>
                </template>
            </el-table-column>
            <el-table-column label="账户佣金" align="center">
                <template #default="scope">
                    <span>{{ scope.row.commission }}</span>
                </template>
            </el-table-column>
            <el-table-column label="已提现佣金" align="center">
                <template #default="scope">
                    <span>{{ scope.row.cash_out_price }}</span>

                </template>
            </el-table-column>
            <el-table-column label="未提现佣金" align="center">
                <template #default="scope">
                    <span>{{ scope.row.no_cash_out_price }}</span>

                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button size="small" type="primary" plain
                        @click="openDetailDialog(scope.row.id)">查看推广明细</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalCount"
                :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>

        <PromotionDetails :userID="currentUserId" />
    </el-card>
</template>

<script setup>
import { ref , watch } from 'vue';
import { getAgent } from '../api/distributor';
import PromotionDetails from '../components/PromotionDetails.vue';

let keyName = ref('')
let currentPage = ref(1)
let timeRange = ref('all')
let isLoading = ref(false)
let tableData = ref([])
let totalCount = ref(0)
let currentUserId = ref(null)

let isloding = ref(false)

const defaultAvatar = 'https://pic1.imgdb.cn/item/6422b55ba682492fcc9c52bd.jpg'

const getAllagent = async () => {
    isLoading.value = true
    let result = await getAgent(currentPage.value, timeRange.value, keyName.value)
    console.log(result)
    try {
        tableData.value = result.data.list
        totalCount.value = result.data.totalCount
    } finally {
        isLoading.value = false
    }
}
getAllagent()


const openDetailDialog = (userID) => {
    currentUserId.value = null
    isloding.value = true
    setTimeout(() => {
        currentUserId.value = userID
    }, 50)
    console.log("传递的ID:", userID)
}

const handleSizeChange = (val) => {
    pageSize.value = val          // 更新每页条数
    currentPage.value = 1         // 重置到第一页
    getAllagent()                 // 重新获取数据
}

const handleCurrentChange = (val) => {
    currentPage.value = val       // 更新当前页码
    getAllagent()                 // 重新获取数据
}

const handSearch = ()=>{
    getAllagent();
}

const handleTimeChange = (val) => {
    // val 就是用户选中的 label 值：'all', 'today', 'yesterday', 'week'
    console.log('用户选择了：', val)
    
    // 直接把这个值传给后端
    // 后端会根据这个值去数据库里筛选对应的数据
    getAllagent()
}

watch(() => keyName.value , (newVal)=>{
    if(newVal == ''){
        getAllagent();
    }
})

</script>

<style scoped>
.el-card {
    margin-top: 15px;
    height: 98vh;

    .hander {
        display: flex;
        justify-content: space-between;
        padding: 0;

        .el-input {
            width: 35%;
        }
    }

    .el-table {
        margin-top: 15px;
        height: calc(98vh - 260px);

        .el-image {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }

        .el-button {
            height: 30px;
            cursor: pointer;
            border-radius: 10px;
        }
    }

    .pagination {
        display: flex;
        justify-content: center;
        margin-top: 15px;
    }
}
</style>