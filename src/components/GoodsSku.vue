<template>
    <el-dialog v-model="isDialog" title="设置商品单/多规格" width="60%" destory-on-close @close="CloseDialog">
        <el-form v-loading="isLoading" :model="SkuFormModel" label-width="120px">
            <el-form-item label="规格类型">
                <el-radio-group v-model="SkuFormModel.sku_type">
                    <el-radio :value="0" border>单规格</el-radio>
                    <el-radio :value="1" border>多规格</el-radio>
                </el-radio-group>
            </el-form-item>

            <!-- 判断当前需要显示的是单规格表单还是多规格表格 -->
            <template v-if="SkuFormModel.sku_type == 0">
                <el-form-item label="市场价格">
                    <el-input-number v-model="SkuFormModel.sku_value.oprice" :min="1" contorlos-position="right"
                        :precision="2" :step="0.01" style="width: 90%;" align="left">
                        <template #suffix>元</template>
                    </el-input-number>
                </el-form-item>
                <el-form-item label="销售价格">
                    <el-input-number v-model="SkuFormModel.sku_value.pprice" :min="1" contorlos-position="right"
                        :precision="2" :step="0.01" style="width: 90%;" align="left">
                        <template #suffix>元</template>
                    </el-input-number>
                </el-form-item>
                <el-form-item label="成本价格">
                    <el-input-number v-model="SkuFormModel.sku_value.cprice" :min="1" contorlos-position="right"
                        :precision="2" :step="0.01" style="width: 90%;" align="left">
                        <template #suffix>元</template>
                    </el-input-number>
                </el-form-item>
                <el-form-item label="重量">
                    <el-input-number v-model="SkuFormModel.sku_value.weight" contorlos-position="right" :precision="1"
                        :step="0.1" style="width: 90%;" align="left">
                        <template #suffix>公斤</template>
                    </el-input-number>
                </el-form-item>
                <el-form-item label="商品体积">
                    <el-input-number v-model="SkuFormModel.sku_value.volume" contorlos-position="right" :precision="1"
                        :step="0.1" style="width: 90%;" align="left">
                        <template #suffix>立方米</template>
                    </el-input-number>
                </el-form-item>
            </template>
            <template v-else-if="SkuFormModel.sku_type == 1">
                <!-- 显示多规格表格 -->
                <GoodsSkuAdd></GoodsSkuAdd>
                <GoodsSkuTable></GoodsSkuTable>
            </template>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="CloseDialog">取消</el-button>
                <el-button style="background-color: #1AA094;color: white; " @click="editskudatafn">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch, reactive } from 'vue';
import { editSkuFn, getGoodsMessageFn } from '../api/goods';
import { ElMessage } from 'element-plus';
import GoodsSkuAdd from './GoodsSkuAdd.vue';
import GoodsSkuTable from './GoodsSkuTable.vue';
import { goodID, initSkuListFn, skuTable } from '../api/useSku';


let isDialog = ref(false);
let isLoading = ref(false);

// 初始化表单对象
const SkuFormModel = reactive({
    sku_type: 0,                //0为单规格，1为多规格
    sku_value: {
        oprice: 0,               //市场价格
        pprice: 0,               //销售价格
        cprice: 0,               //成本价格
        weight: 0,               //重量
        volume: 0                //商品体积
    }

})

const props = defineProps({
    propID: Number,
})

const emits = defineEmits(['update:propID']);
/************************************************************************************************** */
watch(() => props.propID, (newVal) => {
    newVal == 0 ? CloseDialog() : OpenDiaolog();
})

// 初始化提交单规格商品数据
const editskudatafn = async () => {
    isLoading.value = true;

    let data = {
        sku_type : SkuFormModel.sku_type,
        sku_value : SkuFormModel.sku_value
    }

    // 如果多规格也设置了书恐惧，将其赋值给goodsSKus
    if( SkuFormModel.sku_type == 1 ){
        data.goodsSkus = skuTable.value
    }

    let result = await editSkuFn(props.propID, data)
    if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg);

    isLoading.value = false;

    ElMessage.success('设置规格成功')
    CloseDialog();
}

// 打开对话框函数
const OpenDiaolog = async () => {
    // 将当前商品ID传给JS文件的变量
    goodID.value = props.propID;


    isDialog.value = true;
    isLoading.value = true;

    let result = await getGoodsMessageFn(props.propID)

    isLoading.value = false;


    if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg);

    // 向表单赋值
    SkuFormModel.sku_type = result.data.sku_type;
    SkuFormModel.sku_value = result.data.sku_value || {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,
        volume: 0
    };


    console.log('传给 initSkuListFn 的数据:', result.data);
    // 向useSku.js文件传递商品规格列表
    initSkuListFn(result.data);
}

// 关闭对话框函数
const CloseDialog = () => {
    emits('update:propID', 0)
    isDialog.value = false;
}


</script>