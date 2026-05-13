<template>
    <el-card class="skuscom">
        <!-- 按钮：新增+批量删除按钮 -->
        <header>
            <el-button type="primary" size="small" @click="useDialog('新增规格')">新增</el-button>
            <el-button type="danger" size="small">批量删除</el-button>
        </header>

        <!-- 表格 -->
        <!-- el-table-column 设置type属性为selection,表示第一列为复选框控件；当设置了该属性后，整个表格都将触发选中事件selection-change事件 -->
        <el-table :data="skuslist" stripe border style="width: 100%;">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-column prop="name" label="规格名称" align="center" />
            <el-table-column prop="default" label="规格数据" align="center" />
            <el-table-column prop="order" label="排序(从大到小)" align="center" />

            <el-table-column label="规格使用状态" align="center">
                <template #default="scoped">
                    <div>
                        <el-switch v-model="scoped.row.status" :active-value="1" :inactive-value="0" inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scoped">
                    <!-- scoped.row:表示当前行的数据 / 当前正在循环的数据 -->
                    <el-button type="warning" plain size="small" @click="useDialog('编辑规格' , scoped.row)">
                        <el-icon><Edit/></el-icon>
                    </el-button>
                    <el-button type="danger" plain size="small">
                        <el-icon>
                            <Delete/>
                        </el-icon>
                    </el-button>

                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
         <div class="pageArea">
            <el-pagination size="small" background layout="prev , pager , next" :total="total" v-model:current-page="page"></el-pagination>
         </div>
    </el-card>

    <UpdateSkus v-model:prop-title="title" :propsItem="item"/>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { getSkuListFn } from '../api/skus';
import { ref } from 'vue';
import UpdateSkus from '../components/UpdateSkus.vue';
/************************************************************************ */
let page = ref(1);                  //当前页码，默认为1
let total = ref(0);                 //规格数据的总条数
let skuslist = ref([]);             //商品规格列表数据
let title = ref('')                 //对话框标题
let item = ref({})                  //编辑时传给对话框的数据

/************************************************************************ */

// 初始化查询商品规格列表函数
const getSkusDataFn = async () => {
    let result = await getSkuListFn(page.value);
    if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg)

    // 将请求反馈的数据赋值给当前组件变量
    skuslist.value = result.data.list;
    total.value = result.data.totalCount;
}
getSkusDataFn();

// 调用对话框
// text参数：传递给对话框的标题，必填；val参数：在编辑按钮下才会发生传递的数据，可填
const useDialog = (text , val={})=>{
    title.value = text;
    // 判断：只有在“编辑规格”文本下才进行复制，否则清空
    item.value = text == '编辑规格' ? val : {};
}
</script>

<style scoped lang="less">
.skuscom{
    margin-top: 20px;
    height: 500px;

    .el-table{
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .pageArea{
        height: 50px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>