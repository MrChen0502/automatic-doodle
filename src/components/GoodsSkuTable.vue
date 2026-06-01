<template>
    <el-form-item label="规格设置">
        <!-- 设置表格 -->
        <table cellpadding="0" cellspacing="0">
            <!-- 列标题 -->
            <thead>
                <tr>
                    <th v-for="(item,index) in tableTitle" :key="index" :colspan="item.col" :rowspan="item.row">
                        {{ item.name }}
                    </th>
                    <!-- <th colspan="2">商品规格</th>
                    <th rowspan="2">市场价格</th>
                    <th rowspan="2">销售价格</th>
                    <th rowspan="2">成本价格</th>
                    <th rowspan="2">库存</th>
                    <th rowspan="2">商品体积</th>
                    <th rowspan="2">商品重量</th>
                    <th rowspan="2">编码</th> -->
                </tr>
                <tr>
                    <th  v-for="(item,index) in isSkuVal" :key="index" width="60">
                        {{ item.name }}
                    </th>
                    <!-- <th width="60">尺寸</th>
                    <th width="60">颜色</th> -->
                </tr>
            </thead>
            <tbody align="center">
                <tr v-for="item in skuTable" :key="item.id">
                    <td v-for="val in item.skus" :key="val.id">
                        {{ val.value }}
                    </td>
                    <!-- <td>L</td>
                    <td>绿色</td>
                    <td>
                        <input type="number">
                    </td>
                    <td>
                        <input type="number">
                    </td>
                    <td>
                        <input type="number">
                    </td>
                    <td>
                        <input type="number">
                    </td>
                    <td>
                        <input type="number">
                    </td>
                    <td>
                        <input type="number">
                    </td>
                    <td>
                        <input type="number">
                    </td> -->
                </tr>
            </tbody>
        </table>
    </el-form-item>
</template>

<script setup>
import { initTableData } from '../api/useSku';

// 结构数据
const {
    isSkuVal,
    tableTitle,
    skuTable,
} = initTableData();
</script>

<style scoped lang="less">
table {
    border: 1px solid #dbdbdb;
    width: 100%;

    thead tr th {
        border: 1px solid #dbdbdb;
        text-align: center;
    }

    tbody tr td {
        border: 1px solid #dbdbdb;
        text-align: center;

        input {
            width: 55%;
            height: 20px;
            border: 1px solid #dbdbdb;
        }
    }
}
</style>