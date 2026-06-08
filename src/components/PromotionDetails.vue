<template>
    <el-dialog v-model="visible" title="推广明细">
        <el-form>
            <el-form-item label="时间选择">
                <el-radio-group v-model="timeRange">
                    <el-radio-button label="all" type="primary">全部</el-radio-button>
                    <el-radio-button label="today" type="primary">今天</el-radio-button>
                    <el-radio-button label="yesterday" type="primary">昨天</el-radio-button>
                    <el-radio-button label="week" type="primary">最近7天</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="开始日期">
                <el-date-picker placeholder="开始日期" v-model="startdate"></el-date-picker>
            </el-form-item>

            <el-form-item label="结束日期">
                <el-date-picker placeholder="结束日期" v-model="enddate"></el-date-picker>
            </el-form-item>

            <el-form-item label="用户类型">
                <el-radio-group v-model="stimeRange">
                    <el-radio-button label="sall" type="primary">全部</el-radio-button>
                    <el-radio-button label="Primarypromotion" type="primary">一级推广</el-radio-button>
                    <el-radio-button label="SecondaryPromotion" type="primary">二级推广</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" v-model="keyall">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-table>
            <el-table-column label="头像" align="center">

            </el-table-column>

            <el-table-column label="用户信息" align="center">

            </el-table-column>

            <el-table-column label="推广数量" align="center">

            </el-table-column>

            <el-table-column label="推广订单数量" align="center">

            </el-table-column>

            <el-table-column label="创建时间" align="center">

            </el-table-column>
        </el-table>

    </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

let timeRange = ref('all')
let stimeRange = ref('sall')
let visible = ref(false)

let startdate = ref('')
let enddate = ref('')

let keyall = ref('')

const props = defineProps({
    userID: {
        type: Number,
        required: true
    }
})

watch(() => props.userID, (newVal) => {
    console.log(props.userID);
    if (newVal) {
        visible.value = true
    } else {
        visible.value = false;
    }
})
</script>

<style scoped>
.el-dialog{
    .el-form{
        margin-left: 60px;

        .el-button{
            margin-left: 66px;
        }
    }
}
</style>