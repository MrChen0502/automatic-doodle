<template>
    <div class="order">
        <el-card class="order-card">
            <!-- 顶部固定区域 -->
            <div class="header-fixed">
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

                <div class="toolbar">
                    <el-input v-model="shops" placeholder="请输入订单号" clearable @clear="handclear" @keyup.enter="handSearch" style="width: 300px;">
                        <template #append>
                            <el-button :icon="Search" @click="handSearch" />
                        </template>
                    </el-input>

                    <div class="buttons">
                        <el-button type="danger" @click="deleteorders">批量删除</el-button>
                        <el-button type="primary" @click="handleExportExcel">导出订单</el-button>
                    </div>
                </div>
            </div>

            <el-table :data="tableData" v-loading="isLoading" style="width: 100%;" border stripe class="scroll-table"  @selection-change="CheckChange">
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

                <el-table-column prop="username" label="购买会员" width="200" align="center">
                    <template #default="scope">
                        {{ scope.row.user?.username }}
                    </template>
                </el-table-column>

                <!-- 状态 -->
                <el-table-column prop="payment_method" label="交易状态" width="200" align="center">
                    <template #default="scope">
                        <div
                            style="display: flex; flex-direction: column; gap: 10px; align-items: flex-start; padding: 5px 0;">
                            <div>
                                <span style="margin-right: 5px;">付款状态：</span>
                                <el-button type="primary" plain size="small" style="padding: 2px 8px;">
                                    {{ scope.row.payment_method === 'alipay' ? '支付宝支付' : '未支付' }}
                                </el-button>
                            </div>
                            <div>
                                <span style="margin-right: 5px;">发货状态：</span>
                                <el-button type="info" plain size="small" style="padding: 2px 8px;">
                                    {{ scope.row.ship_status === 'pending' ? '待发货' : scope.row.ship_status || '未知' }}
                                </el-button>
                            </div>
                            <div>
                                <span style="margin-right: 5px;">收货状态：</span>
                                <el-button type="info" plain size="small" style="padding: 2px 8px;">
                                    {{ scope.row.refund_status === 'pending' ? '待处理' : scope.row.refund_status || '未知'
                                    }}
                                </el-button>
                            </div>
                        </div>
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
import { ElMessage, ElMessageBox } from 'element-plus';
import OrderDetail from '../components/OrderDetail.vue';
import { exportOrders , deleteOrders } from '../api/order';


const activeName = ref('all');
const shops = ref('');
const tableData = ref([])
let page = ref(1);              //当前页码，默认第一页
let ids = ref([])               //初始化删除数组

let isLoading = ref(false);      //设置加载动画



const currentOrder = ref([])
const isDialog = ref(false)


const handleClick = (tab) => {
    activeName.value = tab.props.name;
    getOrdersData();
}

// 查询订单数据
const getOrdersData = async (no = '') => {
    isLoading.value = true;
    let result = await getOrder({
        page: page.value,
        tab: activeName.value,
        no : no
    });
    console.log(no);
    console.log("当前查询到的数据是：", result);
    isLoading.value = false;
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

// 导出成excel表格
const handleExportExcel = async () => {
    let res = await exportOrders(activeName.value)
    const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = '订单列表.xlsx'
    a.click()
    ElMessage.success('导出成功')
}

// 搜索
const handSearch = ()=>{
    page.value = 1
    getOrdersData(shops.value);
}

// 清空表单，返回主页面
const handclear = ()=>{
    shops.value = ''
    page.value = 1
    getOrdersData();
}

// 初始化获取表格内复选框的选中数据
const CheckChange = (arr)=>{
    ids.value = arr.map(item => {
        return item.id
    })
    console.log(ids.value);
}

// 批量删除
const deleteorders = async()=>{

    let isDel = await ElMessageBox.confirm('是否删除被选中的数据？' , '批量删除' , {
        confirmButtonText : '删除所选',
        cancelButtonText : '取消',
        type : 'warning'
    }).catch( error => console.log(error) );

    if(isDel == 'confirm'){
        // 执行批量删除操作
        let result = await deleteOrders(ids.value)

        console.log(result);
        if(result.msg != 'ok' || !result.data)return ElMessage.error(result.msg);

        getOrdersData();
    }
}


</script>

<style scoped>
.order {
    width: 100%;

    .el-card {
        width: 100%;
        max-width: 1400px;
        /* 限制最大宽度 */
        margin: 20px auto;
        /* 居中 */

        .el-table {
            margin-top: 20px;
            height: calc(100vh - 300px);
            /* 根据窗口高度自动计算 */
            overflow-y: auto;
        }

        .buttons {
            margin-top: 18px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
    }
}
</style>