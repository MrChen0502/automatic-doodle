<template>
    <el-aside>
        <div class="piclistaside">
            <div class="cate-item" :class="{ active: isActive == item.id }" v-for="item in catePicList" :key="item.id">
                <span @click="clickupdate(item.id)">{{ item.name }}</span>
                <em>
                    <el-button type="primary" text @click="$emit('edit', item)">
                        <el-icon>
                            <Edit />
                        </el-icon>
                    </el-button>
                    <el-button type="primary" text>
                        <el-icon>
                            <Close plain @click="deletePics(item.id)" />
                        </el-icon>
                    </el-button>
                </em>
            </div>
        </div>
        <!-- 分页区 -->
        <div class="page">
            <el-pagination layout="prev,pager,next" :total="total" v-model:current-page="currentPage"
                @current-change="handleCurrentPage" />
        </div>
    </el-aside>
</template>

<script setup>
import { Edit, Close } from '@element-plus/icons-vue';
import { getPicsCateList } from '@/api/pics'
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { deletePicsCateList } from '@/api/pics';
import { ElMessageBox } from 'element-plus';

// 定义空数组
let catePicList = ref([])
// 定义总页数，默认为0
let total = ref(0)
// 默认选中的分类项id
let isActive = ref(0)
// 定义每页显示的条数
let pageSize = ref(10)
// 定义当前页码
let currentPage = ref(1)
// 定义自定义事件
const emit = defineEmits(['changeid'])


// 发起请求获取第一页的分类数据以及总条数
const getPicCateData = async () => {
    let result = await getPicsCateList(currentPage.value, pageSize.value)

    if (result.msg != 'ok' || !result.data) {
        ElMessage.error('获取分类数据失败')
        return
    }

    // 没有问题可以赋值
    catePicList.value = result.data.list;
    total.value = result.data.totalCount


    if (catePicList.value.length > 0) {
        isActive.value = catePicList.value[0].id
        // 首次加载，直接 emit，不调用 clickupdate
        emit('changeid', isActive.value)
    }


    // // 获取当前分类数据的第一条数据的id
    // isActive.value = catePicList.value[0].id

    // //自动调用函数:将默认选中的第一项分类对应的图片数据进行查询
    // clickupdate(isActive.value)

}

const deletePics = async (val) => {
    try {
        await ElMessageBox.confirm(
            '确定要删除该图库分类吗？删除后无法恢复！',
            '删除确认',
            {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )

        let result = await deletePicsCateList(val)

        if (result.msg === 'ok') {
            ElMessage.success('删除成功')
            // 删除成功后再刷新列表
            await getPicCateData()
        } else {
            ElMessage.error(result.msg || '删除失败')
        }
    } catch {
        ElMessage.info('已取消删除')
    }
}

// const changeCateID = (id) => {
//     //修改默认选中的数据
//     isActive.value = id;
//     // 将子组件的数据传递给父组件
//     emit('changeid', id);
//     console.log(id);
// }

const clickupdate = (id) => {

    // 如果点击的是已经选中的分类，直接返回，不触发任何操作(第一次加载除外)
    if (isActive.value == id) return

    //修改默认选中的数据
    isActive.value = id;
    // 将子组件的数据传递给父组件
    emit('changeid', id);
    console.log("所选中的id是:" + id);
}
getPicCateData();



const handleCurrentPage = (val) => {
    currentPage.value = val;
    // 重新发起新一页的数据请求
    getPicCateData();
}


// 向父组件暴露请求查询分类的函数
defineExpose({
    getPicCateData,
    clickupdate
})

</script>

<style scoped lang="less">
.el-aside {
    height: 100%;
    width: 200px;
    border-right: 1px solid #dbdbdb;
    position: relative;

    .page {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 0;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .piclistaside {
        position: absolute;
        top: 0;
        bottom: 50px;
        left: 0;
        right: 0;
        overflow-y: auto;

        .cate-item {
            display: flex;
            height: 45px;
            align-items: center;
            cursor: pointer;

            span {
                padding-left: 10px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100px;
                flex: 1; //占领剩余空间
                height: 45px;
                line-height: 45px;
            }

            em {
                margin-left: auto;
                padding-right: 5px;

                .el-button {
                    margin: 0;
                    width: 30px;
                }
            }

            &:hover {
                background-color: #f3f3f3;
            }

            &.active {
                background-color: #f3f3f3;
            }
        }
    }
}
</style>