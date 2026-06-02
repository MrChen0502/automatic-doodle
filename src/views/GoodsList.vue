<template>
    <div class="goodslist">
        <el-card>
            <!-- 选项卡 -->
            <el-tabs v-model="queryData.tab" @tab-click="setGoodsTab">
                <el-tab-pane name="all" label="全部"></el-tab-pane>
                <el-tab-pane name="chceking" label="审核中"></el-tab-pane>
                <el-tab-pane name="saling" label="出售中"></el-tab-pane>
                <el-tab-pane name="off" label="已下架"></el-tab-pane>
                <el-tab-pane name="min_stock" label="库存预警"></el-tab-pane>
                <el-tab-pane name="delete" label="回收站"></el-tab-pane>
            </el-tabs>

            <!-- 搜索框 -->
            <el-row :gutter="30">
                <el-col :span="10">
                    <!-- 结合插槽，向输入框嵌入一个下拉菜单 -->
                    <el-input placeholder="请输入查询的商品信息" clearable v-model="queryData.title">
                        <template #prepend>
                            <el-select placeholder="请选择商品分类" style="width: 150px;" clearable
                                v-model="queryData.category_id">
                                <el-option v-for="item in categoryData" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </template>

                        <!-- 嵌入一个按钮 -->
                        <template #append>
                            <el-button @click="getGoodsList">
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-input>
                </el-col>


                <!-- 按钮区 -->
                <el-col :span="10">
                    <el-button size="small" type="primary" plain @click="openAddDialog">新增商品</el-button>
                    <el-button size="small" type="danger" plain>批量删除</el-button>
                    <el-button size="small" type="info" plain>上架</el-button>
                    <el-button size="small" type="info" plain>下架</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table :data="tableData" style="margin-bottom: 20px; margin-top: 15px; height: calc(100vh - 340px); "
                v-loading="tableLoading">
                <el-table-column label="商品信息" width="200">
                    <template #default="scoped">
                        <div class="goodinfo">
                            <el-avatar :src="scoped.row.cover" shape="square" fit="cover" />
                            <h1>{{ scoped.row.title }}</h1>
                            <span>￥{{ scoped.row.min_oprice }}</span>
                            <strong>分类：{{ scoped.row.category != null ? scoped.row.category.name : '无分类' }}</strong>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="商品状态" align="center">
                    <template #default="scoped">
                        <div>
                            <el-tag v-show="scoped.row.status == 1" type="warning">上架</el-tag>
                            <el-tag v-show="scoped.row.status == 0" type="info">下架</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" align="center">
                    <template #default="scoped">
                        <div>
                            <el-tag v-show="scoped.row.ischeck == 1" type="success">通过</el-tag>
                            <el-tag v-show="scoped.row.ischeck == 0" type="warning">审核中</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="商品库存" prop="stock" align="center" />
                <el-table-column label="操作" align="center" width="400">
                    <template #default="scoped">
                        <el-button type="warning" plain size="small" @click="handleEditGood(scoped.row)">
                            <el-icon>
                                <Edit />
                            </el-icon>
                        </el-button>
                        <el-button type="info" size="small" plain @click="goodID = scoped.row.id">设置轮播图</el-button>
                        <el-button type="info" size="small" plain @click="infoID = scoped.row.id">设置商品详情</el-button>
                        <el-button type="info" size="small" plain @click="skuID = scoped.row.id">设置商品规格</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区 -->
            <div class="pageArea">
                <el-pagination v-model:current-page="page" v-model:page-size="queryData.limit"
                    :page-sizes="[5, 10, 15, 20, 25, 30, 35, 40]" size="small" layout="sizes, prev, pager, next"
                    :total="total" @current-change="setPage" @size-change="setPagelimit" />
            </div>
        </el-card>

        <!-- 添加/编辑对话框子组件 -->
        <UpdateGood v-model:prop-title="dia_title" :propCategory="categoryData" @success="getGoodsList"
            :propArr="editRowData" />

        <!-- 设置商品轮播子组件 -->
        <GoodBanner ref="goodbannerRef" v-model:propID="goodID" />

        <!-- 设置商品详情子组件 -->
        <GoodInfo ref="goodinfoRef" v-model:propId="infoID" />

        <!-- 设置商品规格子组件 -->
        <GoodsSku v-model:propID="skuID" />
    </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { getGoodsListFn, getGoodsCategoryFn } from '../api/goods';
import { ElMessage } from 'element-plus';
import UpdateGood from '../components/UpdateGood.vue';
import GoodBanner from '../components/GoodBanner.vue';
import GoodInfo from '../components/GoodInfo.vue';
import GoodsSku from '../components/GoodsSku.vue';


let tableData = ref([]);        //传递到表格data属性的数据
let page = ref(16);              //当前页码，默认第一页
let total = ref(0);             //总条数
let tableLoading = ref(false);  //表格加载中

// 查询参数
let queryData = reactive({
    tab: 'all',                //选项卡的值
    title: '',                 //搜索关键词
    category_id: null,         //商品分类ID
    limit: 5,                 //每页条数，默认每页5条数据
})

let categoryData = ref([]);         //获取商品分类(仅显示状态为true/1)
let arr = ref([]);                  //获取商品
let editRowData = ref(null);
let dia_title = ref('')             //对话框标题
let goodID = ref(0);       //轮播商品ID
let infoID = ref(0);       //详情的商品ID
let skuID = ref(0);

const goodbannerRef = ref(null);     //获取子组件的DOM元素
const goodinfoRef = ref(null);       //获取子组件的DOM元素  


/****************************************************************************************** */
// 初始化获取商品列表函数
const getGoodsList = async () => {
    tableLoading.value = true;

    let result = null
    try {
        result = await getGoodsListFn(page.value, queryData);
        console.log(result);
        if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg);

        // 数据赋值
        tableData.value = result.data.list
        total.value = result.data.totalCount;
    } finally {
        // 不管是否报错，都要关闭加载状态
        tableLoading.value = false;
    }
}
getGoodsList();

// 初始化商品分类列表函数
const getGoodsCategory = async () => {
    let result = null
    tableLoading.value=  true;
    try{
        //  result = await getGoodsCategoryFn();
    if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg);

    // 筛选出状态为1的分类数据
    categoryData.value = result.data.filter(item => item.status == 1)
    console.log(categoryData.value);
    }finally{
        tableLoading.value = false
    }
   
}
// getGoodsCategory();

// 分页查询
const setPage = (val) => {
    page.value = val
    getGoodsList();
}

// 初始化更改每页条数的事件函数
const setPagelimit = (val) => {
    queryData.limit = val;
    page.value = 1; // 切换每页条数时，重置为第一页
    getGoodsList();
}

// 初始化标签页的改变事件函数
const setGoodsTab = (val) => {
    queryData.tab = val;
    getGoodsList();
}

// 监听
watch(() => queryData.title, (newVal) => {
    if (newVal == '') {
        getGoodsList();
    }
})

// 打开新增商品对话框
const openAddDialog = () => {
    // 先清空，再赋值，确保触发 watch
    dia_title.value = '';
    setTimeout(() => {
        dia_title.value = '新增商品';
    }, 10);
}


// 打开编辑商品对话框
const handleEditGood = (row) => {
    editRowData.value = row;
    dia_title.value = '';  // 先清空
    setTimeout(() => {
        dia_title.value = '编辑商品';
        // 如果需要回显数据，可以在这里把 row 传给子组件
        // 比如通过另一个 prop 或 store 传递
    }, 10);
}
</script>

<style scoped lang="less">
.goodslist {
    width: 100%;
    height: 100%;

    .el-card {
        margin-top: 20px;
    }


    .goodinfo {
        width: 100%;

        .el-avatar {
            width: 60px;
            height: 60px;
            margin-right: 10px;
            float: left;
        }

        h1 {
            font-size: 14px;
            margin: 0;
            padding: 0;
        }

        span {
            color: red;
            display: block;
            font-size: 12px;
        }

        strong {
            font-size: 12px;
            font-weight: normal;
        }
    }

    .pageArea {
        display: flex;
        justify-content: center;
    }
}
</style>