<template>
    <el-form-item label="规格设置">
        <!-- 设置表格 -->
        <table cellpadding="0" cellspacing="0">
            <!-- 列标题 -->
            <thead>
                <tr>
                    <th colspan="2">商品规格</th>
                    <th rowspan="2">市场价格</th>
                    <th rowspan="2">销售价格</th>
                    <th rowspan="2">成本价格</th>
                    <th rowspan="2">库存</th>
                    <th rowspan="2">商品体积</th>
                    <th rowspan="2">商品重量</th>
                    <th rowspan="2">编码</th>
                </tr>
                <tr>
                    <th width="60">尺寸</th>
                    <th width="60">颜色</th>
                </tr>
            </thead>
            <tbody align="center">
                <tr>
                    <td>L</td>
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
                    </td>
                </tr>
            </tbody>
        </table>
    </el-form-item>
</template>

<script setup>

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