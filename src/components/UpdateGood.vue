<template>
    <el-dialog class="updategood" :title="propTitle" v-model="isDialog" width="40%" @close="CloseDialog" top="2vh" style="margin-bottom: 0;">
        <el-form :model="GoodFormModel" label-width="110px">
            <el-form-item label="商品名称">
                <el-input v-model="GoodFormModel.title" />
            </el-form-item>
            <el-form-item label="商品分类">
                <el-select placeholder="请选择商品分类" style="width: 150px;" clearable v-model="GoodFormModel.category_id">
                    <el-option v-for="item in propCategory" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="封面">
                <SelectImage v-model="GoodFormModel.cover" />
            </el-form-item>
            <el-form-item label="商品单位">
                <el-input v-model="GoodFormModel.unit"></el-input>
            </el-form-item>
            <el-form-item type="number" label="总库存">
                <el-input v-model="GoodFormModel.stock"></el-input>
            </el-form-item>
            <el-form-item label="库存预警">
                <el-input type="number" v-model="GoodFormModel.min_stock"></el-input>
            </el-form-item>
            <el-form-item label="商品原价格">
                <el-input type="number" v-model="GoodFormModel.min_oprice">
                    <template #append>元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="商品描述">
                <el-input type="textarea" :row="2" v-model="GoodFormModel.desc"></el-input>
            </el-form-item>
            <el-form-item label="是否显示库存">
                <el-radio-group v-model="GoodFormModel.stock_display">
                    <el-radio :value="1" border>是</el-radio>
                    <el-radio :value="0" border>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否上架">
                <el-radio-group v-model="GoodFormModel.status">
                    <el-radio :value="1" border>是</el-radio>
                    <el-radio :value="0" border>否</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="CloseDialog">取消</el-button>
                <el-button style="background-color: #1AA094;color: white; " @click="submitFn">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import SelectImage from './SelectImage.vue'
import { InsertGoodFn , editGoodFn } from '../api/goods';
import { ElMessage } from 'element-plus';


let isDialog = ref(false);              //对话框控制变量

// 表单数据对象
const GoodFormModel = reactive({
    title: '',           //商品名称
    category_id: null,   //商品分类ID
    cover: '',           //商品封面
    unit: '件',          //商品单位
    stock: 100,          //商品库存
    min_stock: 10,       //库存预警量
    min_oprice: null,    //商品原价格
    min_price: null,     //商品活动价格
    desc: '',            //商品简述
    stock_display: 1,    //是否显示库存，1=显示，0=隐藏
    status: 1,           //是否上架，1=上架，0=下架
})

const props = defineProps({
    propTitle: String,
    propArr : Object,
    propCategory: Array
})

const emits = defineEmits(['update:propsTitle', 'success']);

// 监听器
watch(() => props.propTitle, (newVal) => {
    newVal != '' ? OpenDialog() : CloseDialog();
})

// 开启对话框函数
const OpenDialog = () => {
    switch (props.propTitle) {
        case '新增商品':
            GoodFormModel.title = '';           //商品名称
            GoodFormModel.category_id = null;   //商品分类ID
            GoodFormModel.cover = '';           //商品封面
            GoodFormModel.unit = '件';          //商品单位
            GoodFormModel.stock = 100;          //商品库存
            GoodFormModel.min_stock = 10;       //库存预警量
            GoodFormModel.min_oprice = null;    //商品原价格
            GoodFormModel.min_price = null;     //商品活动价格
            GoodFormModel.desc = '';            //商品简述
            GoodFormModel.stock_display = 1;    //是否显示库存，1=显示，0=隐藏
            GoodFormModel.status = 1;           //是否上架，1=上架，0=下架
            break;
        case '编辑商品':
            console.log(props.propArr.id);
            GoodFormModel.title = props.propArr.title;           //商品名称
            GoodFormModel.category_id = props.propArr.category_id;   //商品分类ID
            GoodFormModel.cover = props.propArr.cover;           //商品封面
            GoodFormModel.unit = props.propArr.unit;          //商品单位
            GoodFormModel.stock = props.propArr.stock;          //商品库存
            GoodFormModel.min_stock = props.propArr.min_stock;       //库存预警量
            GoodFormModel.min_oprice = props.propArr.min_oprice;    //商品原价格
            GoodFormModel.min_price = props.propArr.min_price;     //商品活动价格
            GoodFormModel.desc = props.propArr.desc;            //商品简述
            GoodFormModel.stock_display = props.propArr.stock_display;    //是否显示库存，1=显示，0=隐藏
            GoodFormModel.status = props.propArr.status;           //是否上架，1=上架，0=下架
            break;
    }
    isDialog.value = true;
}

// 关闭对话框函数
const CloseDialog = () => {
    emits('update:propsTitle', '')
    isDialog.value = false;
}

// 初始化提交事件
const submitFn = async()=>{
    let result;
    switch ( props.propTitle ){
        case '新增商品':
            result = await InsertGoodFn(GoodFormModel);
            console.log(result);
            if(result.msg != 'ok' || !result.data)return ElMessage.error(result.msg);

            ElMessage.success('添加成功');
            emits('success')
            break;
        case '编辑商品':
            result = await editGoodFn(props.propArr.id,GoodFormModel);
            console.log(result);
            if(result.msg != 'ok' || !result.data)return ElMessage.error(result.msg);

            ElMessage.success('添加成功');
            emits('success')
            break;
    }

    // 通知父组件添加/编辑执行成功

    // 关闭弹窗
    isDialog.value = false;
}
</script>

<style scoped lang="less">
</style>