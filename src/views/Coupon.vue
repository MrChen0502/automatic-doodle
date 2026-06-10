<template>
    <div>
        <el-card>
            <el-button type="primary" @click="dialogVisible = true">新增</el-button>

            <el-table :data="tableData" v-loading="isLoading">
                <el-table-column label="优惠券名称" align="center" width="420">
                    <template #default="scope">
                        <div class="divdesc">
                            <div>
                                {{ scope.row.name || scope.row.desc }}
                            </div>
                            <div>
                                {{ scope.row.start_time }}-{{ scope.row.end_time }}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template #default="scope">
                        <el-tag :type="getStatusType(scope.row)">
                            {{ getStatusText(scope.row) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="优惠" prop="name" align="center" />
                <el-table-column label="发送数量" prop="total" align="center" />
                <el-table-column label="已使用" prop="used" align="center" />
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button type="danger" @click="detetecouponlist(scope.row.id)">
                            <el-icon>
                                <Delete />
                            </el-icon>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalCount"
                    :page-sizes="[10, 20, 50, 70, 100]" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>

            <!-- 弹窗 -->
            <el-dialog v-model="dialogVisible" title="新增优惠券">
                <el-form label-width="120px">
                    <el-form-item label="优惠券名称">
                        <el-input v-model="CouponName" />
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-radio-group v-model="radio1">
                            <el-radio :value="1">满减</el-radio>
                            <el-radio :value="0">折扣</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="面值">
                        <el-input v-model="Denomination">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="数量">
                        <el-input-number v-model="num" />
                    </el-form-item>
                    <el-form-item label="最低使用价格">
                        <el-input v-model="Lowestprice">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input v-model="Description" />
                    </el-form-item>
                    <el-form-item label="活动时间">
                        <el-date-picker v-model="time" type="datetimerange" range-separator="To"
                            start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss"
                            value-format="x" />
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input-number v-model="sortlist" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button @click="addCoipon">确定</el-button>
                </template>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getallcoupon, addcoupon, deletecoupon } from '../api/coupon';
import { ElMessage, ElMessageBox } from 'element-plus';

let isLoading = ref(false)
let dialogVisible = ref(false)

let currentPage = ref(1)
let pageSize = ref(10)
let totalCount = ref(0)
let tableData = ref([])

let Denomination = ref(0)       //面值
let CouponName = ref('')        //优惠券名称
let radio1 = ref(1)            //类型
let num = ref(100)              //数量
let Lowestprice = ref(1)        //最低使用价格
let Description = ref('')       //描述
let time = ref([])              //时间
let sortlist = ref(1)           //排序

// 重置表单
const resetForm = () => {
    CouponName.value = ''
    radio1.value = 1
    Denomination.value = 0
    num.value = 100
    Lowestprice.value = 1
    Description.value = ''
    time.value = []
    sortlist.value = 1
}


const getCouponAll = async () => {
    isLoading.value = true
    let result = null;
    try {
        // 调用接口函数，拿取后端数据库内的数据
        result = await getallcoupon(currentPage.value);

        // 通过控制台查询数据结构
        console.log("优惠券数据：", result);

        // 判断是否有误
        if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg)

        // 赋值
        tableData.value = result.data.list
        totalCount.value = result.data.totalCount
    } finally {
        isLoading.value = false
    }
}
getCouponAll();


// 切换每页条数：更新pageSize并重置到第一页，重新加载数据
const handleSizeChange = (val) => {
    pageSize.value = val
    currentPage.value = 1
    getCouponAll()
}

// 切换页码：更新当前页码，重新加载数据
const handleCurrentChange = (val) => {
    currentPage.value = val
    getCouponAll()
}


// 获取状态类型（用于 el-tag 的颜色）
const getStatusType = (row) => {
    const now = new Date()
    const start = new Date(row.start_time)
    const end = new Date(row.end_time)

    if (now < start) return 'info'                      // 未开始：灰色
    if (now >= start && now <= end) return 'success'    // 进行中：绿色
    return 'danger'                                     // 已结束：红色
}

// 获取状态文本
const getStatusText = (row) => {
    const now = new Date()
    const start = new Date(row.start_time)
    const end = new Date(row.end_time)

    if (now < start) return '未开始'
    if (now >= start && now <= end) return '进行中'
    return '已结束'
}


// 新增优惠券
const addCoipon = async () => {
    // 1. 关闭弹窗
    dialogVisible.value = false;
    // 2. 开启加载状态
    isLoading.value = true;

    // 3. 解构时间范围
    const [start_time, end_time] = time.value

    // 4. 校验：是否选择了活动时间
    if (!time.value || time.value.length !== 2) {
        ElMessage.warning('请选择活动时间')
        isLoading.value = false;  // 关闭加载状态
        return
    }

    // 5. 校验：开始时间必须大于当前时间
    if (start_time <= Date.now()) {
        ElMessage.warning('活动开始时间必须大于当前时间！！！')
        isLoading.value = false;  // 关闭加载状态
        return
    }

    // 6. 构建优惠券数据对象
    const CouponList = {
        name: CouponName.value,         // 优惠券名称
        type: radio1.value,             // 类型：1=满减，0=折扣
        value: Denomination.value,      // 面值（优惠金额）
        total: num.value,               // 发放数量
        min_price: Lowestprice.value,   // 最低使用价格
        desc: Description.value,        // 描述
        start_time: start_time,         // 开始时间（时间戳）
        end_time: end_time,             // 结束时间（时间戳）
        order: sortlist.value,          // 排序
    }

    // 7. 调用新增接口
    let result = null;
    try {
        result = await addcoupon(CouponList);
        
        // 8. 检查接口返回结果
        if (result.msg !== 'ok' || !result.data) {
            ElMessage.error(result.msg || '添加失败')
            return
        }

        // 9. 成功提示
        ElMessage.success('添加成功！！')

        // 10. 刷新列表（重新获取数据）
        await getCouponAll();

        // 11. 重置表单数据
        resetForm();

    } finally {
        // 13. 关闭加载状态（无论成功或失败都会执行）
        isLoading.value = false;
    }
}

// 删除优惠券
const detetecouponlist = async (id) => {
    // 1. 添加确认弹窗
    const confirmResult = await ElMessageBox.confirm(
        '确定要删除该优惠券吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(() => {
        // 用户取消删除
        return false;
    });

    if (!confirmResult) return;

    // 2. 开始加载
    isLoading.value = true;
    
    try {
        // 3. 调用删除接口
        const result = await deletecoupon(id);
        
        // 4. 检查返回结果
        if (result.msg !== 'ok' || !result.data) {
            ElMessage.error(result.msg || '删除失败');
            return;
        }

        // 5. 刷新列表
        await getCouponAll();
        
        // 6. 成功提示
        ElMessage.success('删除成功！');
        
    } catch (error) {
        // 7. 错误处理
        console.error('删除失败:', error);
        ElMessage.error('删除失败，请稍后重试');
    } finally {
        // 8. 关闭加载状态
        isLoading.value = false;
    }
}
</script>

<style scoped>
.el-card {
    height: 98vh;
    margin-top: 15px;

    .el-table {
        height: calc(98vh - 240px);
    }

    .pagination {
        display: flex;
        justify-content: center;
        margin-top: 15px;
    }

    .divdesc {
        background-color: rgb(172, 172, 172);
        border-radius: 10px;
    }
}
</style>