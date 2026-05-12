<template>
    <div class="order">
        <el-card>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name="all"></el-tab-pane>
                <el-tab-pane label="待支付" name="pending_payment"></el-tab-pane>
                <el-tab-pane label="待发货" name="pending_delivery"></el-tab-pane>
                <el-tab-pane label="待收货" name="Pending_receipt"></el-tab-pane>
                <el-tab-pane label="已收货" name="Goods_received"></el-tab-pane>
                <el-tab-pane label="已完成" name="Completed"></el-tab-pane>
                <el-tab-pane label="已关闭" name="Closed"></el-tab-pane>
                <el-tab-pane label="退款中" name="Refund_in_progress"></el-tab-pane>
            </el-tabs>



            <el-input v-model="shops" placeholder="请输入订单号" clearable style="width: auto;">
                <template #append>
                    <el-button :icon="Search" @click="" />
                </template>
            </el-input>

            <div class="buttons">
                <el-button type="danger">批量删除</el-button>
                <el-button type="primary">导出订单</el-button>
            </div>


            <el-table :data="tableData" style="width: 100%; margin-top: 20px;" border stripe>
                <!-- 多选框 -->
                <el-table-column type="selection" width="40" align="center" />

                <el-table-column prop="title" label="商品信息" align="center">
                    <template #default="scope">
                        订单号:{{ scope.row.no }}<br />
                        下单时间:{{ scope.row.create_time }}<br />
                        <div v-for="item in scope.row.order_items" :key="item.goods_id"
                            style="display: flex; align-items: center; margin-top: 8px;  padding-top: 8px; justify-content: center;">
                            <!-- 商品图片 -->
                            <img :src="item.goods_item?.cover" alt="商品图"
                                style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />
                            <div style="font-size: 14px; font-weight: 500;">{{ item.goods_item?.title }}</div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="total_price" label="实付款" width="80" align="center" />

                <el-table-column prop="" label="购买会员" width="200" align="center">
                    <template #default="scope">
                        {{ scope.row.user?.username }}
                    </template>
                </el-table-column>

                <!-- 状态 -->
                <el-table-column prop="" label="交易状态" width="200" align="center">
                    <template #default="scope">
                        {{ }}
                    </template>
                </el-table-column>


                <!-- 状态 -->
                <el-table-column prop="" label="操作" width="200" align="center">
                    <template #default="scope">
                        <el-button type="primary" plain @click="Opdialog(scope.row)">订单详情</el-button>

                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <OrderDetail v-model:orderbale="isDialog" :orderData="currentOrder" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { getOrder } from '../api/order';
import { ElMessage } from 'element-plus';
import OrderDetail from '../components/OrderDetail.vue';


const activeName = ref('all');
const shops = ref('');
const tableData = ref([])
let page = ref(1);              //当前页码，默认第一页

const currentOrder = ref([])
const isDialog = ref(false)


const handleClick = (tab) => {
    activeName.value = tab.props.name;
    getOrdersData();
}

// 查询订单数据
const getOrdersData = async () => {
    let result = await getOrder({
        page: page.value,
        tab: activeName.value
    });
    console.log("当前查询到的数据是：", result);
    // 解析结果赋值给 tableData
    if (result.msg != 'ok' || !result.data) return ElMessage.error('错误！！！')

    tableData.value = result.data.list
}
getOrdersData();

const Opdialog = (row) => {
    currentOrder.value = row
    isDialog.value = true
    console.log(row);
}
</script>

<style scoped>
.order {
    width: 100%;

    .el-card {
        width: 100%;
        height: 620px;
        margin-top: 20px;
        overflow-y: auto;

        .buttons {
            margin-top: 18px;
        }
    }
}
</style>