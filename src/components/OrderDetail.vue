<template>
    <el-dialog :model-value="orderbale" @update:model-value="handleUpdate" title="订单详情" width="600px"
        @close="handleClose">
        <div v-if="orderData">
            <!-- 订单信息 -->
            <div class="section">
                <h3 class="section-title">订单信息</h3>
                <div class="info-row">
                    <span class="label">订单号：</span>
                    <span>{{ orderData?.no }}</span>
                </div>
                <div class="info-row">
                    <span class="label">付款方式：</span>
                    <span>{{ orderData?.payment_method }}</span>
                </div>
                <div class="info-row">
                    <span class="label">下单时间：</span>
                    <span>{{ orderData?.create_time }}</span>
                </div>
            </div>

            <el-divider />

            <!-- 商品信息 -->
            <div class="section">
                <h3 class="section-title">商品信息</h3>
                <div v-for="(item, index) in orderData?.order_items" :key="item.goods_id" class="goods-item">
                    <div class="info-row">
                        <span class="label">商品名称：</span>
                        <span>{{ item.goods_item?.title }}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">商品价格：</span>
                        <span>¥{{ item.price }}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">商品数量：</span>
                        <span>{{ item.num }}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">商品规格: </span>
                        <el-tag type="primary" size="small" v-for="sku in item?.goods_skus?.skus"   style="margin-right: 8px;">
                            {{ sku.value }}
                        </el-tag>
                    </div>
                    <div class="info-row">
                        <span class="label">商品总价：</span>
                        <span>¥{{ (item.price * item.num).toFixed(2) }}</span>
                    </div>
                    <el-divider v-if="index < orderData.order_items.length - 1" />
                </div>
            </div>

            <el-divider />

            <!-- 收货信息 -->
            <div class="section">
                <h3 class="section-title">收货信息</h3>
                <div class="info-row">
                    <span class="label">收货人：</span>
                    <span>{{ orderData?.address.name }}</span>
                </div>
                <div class="info-row">
                    <span class="label">联系方式：</span>
                    <span>{{ orderData?.address.phone }}</span>
                </div>
                <div class="info-row">
                    <span class="label">联系地址：</span>
                    <span>{{ orderData?.address.province }}{{ orderData?.address.district }}</span>
                </div>
            </div>
        </div>

        <template #footer>
            <el-button @click="handleClose">关闭</el-button>
        </template>
    </el-dialog>
</template>

<script setup>

const props = defineProps({
    orderbale: {
        type: Boolean,
        default: false
    },
    orderData: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['update:orderbale', 'close'])

const handleUpdate = (val) => {
    emit('update:orderbale', val)
}

const handleClose = () => {
    emit('update:orderbale', false)
    emit('close')
}
</script>

<style scoped>
.section {
    margin-bottom: 10px;
}

.section-title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.info-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
}

.label {
    color: #666;
    width: 100px;
    flex-shrink: 0;
}

.goods-item {
    margin-bottom: 10px;
}
</style>