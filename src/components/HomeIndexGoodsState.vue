<template>
    <div class="homeindexgoodsstate">
        <el-card>
            <div class="g_title">
                {{ gTitle }}
                <span>
                    <el-tag>{{ gDesc }}</el-tag>
                </span>
            </div>
            <!-- 四组小卡片 -->
            <el-row :gutter="20">
                <el-col :span="6"  v-for="item in gData" :key="item">
                    <el-card shadow="hover" class="g_main">
                        <span>{{ item.value }}</span>
                        {{ item.label }}
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup>
// 接收父组件数据的变量
const props = defineProps({
    gTitle: String, //表示只接收字符串数据
    gDesc: String,
    gData: Array, //只接收数组数据
})
</script>

<style scoped lang="less">
.homeindexgoodsstate {
    margin-top: 20px;
    width: 100%;

    .el-card{
        height: auto;
    }

    .g_title {
        border-bottom: 1px solid #dbdbdb;
        line-height: 30px;
        display: flex;
        padding-bottom: 15px;

        span {
            margin-left: auto;

            .el-tag {
                margin-left: 10px;
            }
        }
    }

    .g_main {
        display: flex;
        justify-content: center;
        text-align: center;
        line-height: 25px;
        cursor: pointer;
        margin-top: 10px;
        span {
            display: block;
            font-family: 800;
            font-size: 18px;
        }
    }
}
</style>