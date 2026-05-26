<template>
    <el-form-item label="添加规格">
        <div class="sku_main" v-for="(item,index) in skuList" :key="index">
            <!-- 顶部：标题 -->
            <div class="sku_top">
                <span>
                    <el-button size="small" type="primary">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </el-button>
                </span>
                <el-input class="inputStyle" v-model="item.text">
                    <template #append>
                        <el-button>
                            <el-icon>
                                <Edit />
                            </el-icon>
                        </el-button>
                    </template>
                </el-input>
            </div>
            <!-- 底部：tag标签 -->
            <div class="sku_content">
                <!-- tag标签的操作子组件 -->
                <GoodsSkuAddTag :skuID="item.id"></GoodsSkuAddTag>
            </div>
        </div>
        <el-button type="primary" color="#1AA094" size="small">添加</el-button>
    </el-form-item>
</template>

<script setup>
import GoodsSkuAddTag from './GoodsSkuAddTag.vue';
import { skuList } from '../api/useSku';
</script>

<style scoped lang="less">
.sku_main {
    width: 100%;
    height: auto;
    border: 1px solid #dbdbdb;
    margin-bottom: 20px;

    .sku_top {
        width: 100%;
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #dbdbdb;

        span {
            float: right;
            margin-right: 20px;
        }

        :deep(.el-input) {
            height: 24px !important;
            font-size: 13px;
        }
    }

    .sku_content {
        padding: 10px;
    }

    .inputStyle {
        width: 150px;
        margin-top: 8px;
        margin-left: 10px;
    }
}
</style>