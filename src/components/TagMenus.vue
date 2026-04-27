<template>
    <div class="tagmenu">
        <!-- 
            标签页组件
            v-model="activeTable": 绑定当前激活的标签页，值为标签的name(path)
            type="card": 卡片风格的标签页
            @tab-change: 用户点击切换标签页时触发
            @tab-remove: 点击标签页关闭按钮时触发
        -->
        <el-tabs v-model="activeTable" type="card" @tab-change="ChangeTable" @tab-remove="RemoveTable" class="tabsclass">
            <!-- 
                遍历 tabsList 数组渲染标签页
                :key="item.path": 唯一标识，使用路径作为key
                :label="item.title": 标签页显示的标题
                :name="item.path": 标签页的名称，用于v-model绑定
                :closable: 是否显示关闭按钮，首页不可关闭
            -->
            <el-tab-pane v-for="item in tabsList" :key="item.path" :label="item.title" :name="item.path" :closable="item.path != '/home'"></el-tab-pane>
        </el-tabs>

        <!-- 下拉菜单：用于批量关闭标签页 -->
        <el-dropdown @command="commandClose">
            <span class="el-dropdown-link">
                <el-icon><arrow-down/></el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <!-- command属性绑定命令标识，点击时触发@command事件 -->
                    <el-dropdown-item command="CloseOthers">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="CloseAll">关闭全部</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
// ==================== 导入依赖 ====================
import { ref, watch } from 'vue';  // onBeforeRouteUpdate 需要从 vue-router 导入
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

// ==================== 路由实例 ====================
const route = useRoute();   // 获取当前路由信息
const router = useRouter(); // 获取路由实例，用于编程式导航

// ==================== 响应式数据 ====================
// 当前激活的标签页名称（使用ref包装基本类型）
// 初始值为当前路由的路径
let activeTable = ref(route.path);


// 标签页列表数组（使用ref包装引用类型）
// 初始化时默认包含后台首页
let tabsList = ref([
    { title: '后台首页', path: '/admin/index' },
]);

// ==================== 核心方法 ====================

/**
 * 切换标签页事件处理函数
 * @param {string} path - 目标标签页的name值（即路由路径）
 * 注意：此事件只在用户手动点击标签时触发，不会在代码修改activeTable时触发
 */
const ChangeTable = (path) => {
    // 更新当前激活的标签页
    activeTable.value = path;
    // 路由跳转到对应路径
    router.push(path);
};

watch(activeTable, (newVal, oldVal) => {
    // 当 activeTable 被代码修改时，自动调用 ChangeTable
    ChangeTable(newVal);
});

/**
 * 初始化标签页列表：从sessionStorage中恢复之前保存的标签页数据
 * 用于页面刷新后保持标签页状态
 */
const initTabsList = () => {
    // 从sessionStorage获取存储的标签页数据
    const storedData = sessionStorage.getItem('tabsList');
    if (storedData) {
        // 将JSON字符串解析为数组
        let list = JSON.parse(storedData);
        // 确保解析结果是数组且不为空
        if (Array.isArray(list) && list.length) {
            // 清空当前标签页列表
            tabsList.value.length = 0;
            // 将存储的数据添加到列表中
            tabsList.value.push(...list);
        }
    }
};
// 立即执行初始化
initTabsList();

/**
 * 移除（关闭）标签页事件处理函数
 * @param {string} path - 要关闭的标签页路径
 */
const RemoveTable = (path) => {
    console.log('删除标签:', path);
    
    // 不允许删除首页（业务规则）
    if (path === '/admin/index') {
        ElMessage.warning('不能关闭首页');
        return;
    }
    
    // 使用Element Plus的确认框，防止误关闭
    ElMessageBox.confirm(
        '确定要关闭这个标签吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        // 确认删除：查找要删除的标签在数组中的索引
        const index = tabsList.value.findIndex(item => item.path === path);
        
        if (index !== -1) {
            // 从数组中删除该标签
            tabsList.value.splice(index, 1);
            
            // 更新sessionStorage中的存储
            sessionStorage.setItem('tabsList', JSON.stringify(tabsList.value));
            
            // 如果删除的标签恰好是当前激活的标签
            if (activeTable.value === path) {
                if (tabsList.value.length > 0) {
                    // 激活最后一个标签（用户最后点击的那个）
                    const lastTab = tabsList.value[tabsList.value.length - 1];
                    activeTable.value = lastTab.path;
                    router.push(lastTab.path);
                } else {
                    // 如果没有标签了，跳转到首页（安全兜底）
                    router.push('/admin/index');
                }
            }
            
            ElMessage.success('已关闭标签');
        }
    }).catch(() => {
        // 用户取消删除
        ElMessage.info('已取消关闭');
    });
};

/**
 * 下拉菜单命令处理函数
 * @param {string} res - 命令标识：'CloseAll' 或 'CloseOthers'
 */
const commandClose = (res) => {
    // 关闭全部标签
    if (res == 'CloseAll') {
        // 清空标签数组
        tabsList.value.length = 0;
        // 重新添加首页（首页不可关闭，必须存在）
        tabsList.value.push({ title: '后台首页', path: '/admin/index' });
        // 同步到sessionStorage
        sessionStorage.setItem('tabsList', JSON.stringify(tabsList.value));
        // 跳转到首页
        activeTable.value = '/admin/index';
        router.push('/admin/index');
    }
    
    // 关闭其他标签（关闭除当前激活标签和首页外的所有标签）
    if (res == 'CloseOthers') {
        const currentPath = activeTable.value;
        // 过滤：只保留当前激活的标签和首页
        tabsList.value = tabsList.value.filter(item => 
            item.path === currentPath || item.path === '/admin/index'
        );
        // 同步到sessionStorage
        sessionStorage.setItem('tabsList', JSON.stringify(tabsList.value));
        ElMessage.success('已关闭其他标签');
    }
};

/**
 * 添加标签页到列表
 * @param {Object} obj - 标签页对象 { title: '标题', path: '/路径' }
 * 功能：如果标签页不存在则添加，然后保存到sessionStorage
 */
const AddTabsList = (obj) => {
    // 检查标签页是否已存在（根据path判断）
    const result = tabsList.value.findIndex(item => item.path == obj.path);
    if (result == -1) {
        // 不存在则添加
        tabsList.value.push(obj);
    }
    // 将更新后的列表保存到sessionStorage，用于页面刷新后恢复
    window.sessionStorage.setItem('tabsList', JSON.stringify(tabsList.value));
};

/**
 * 路由更新前的钩子函数
 * 当路由即将更新时触发（用户点击链接、调用router.push等）
 * 用于同步标签页状态到当前路由
 */
onBeforeRouteUpdate((to, from) => {
    // 更新当前激活的标签页为即将跳转的路径
    activeTable.value = to.path;
    // 构造新的标签页对象
    let obj = {
        title: to.meta.title,  // 从路由meta中获取标题
        path: to.path
    };
    // 将标签页添加到列表（如果不存在）
    AddTabsList(obj);
});

// ==================== 可选：监听activeTable变化 ====================
// 注意：@tab-change事件不会在代码修改activeTable时触发
// 如果需要监听activeTable的变化，可以使用watch
/*
watch(activeTable, (newVal, oldVal) => {
    console.log('activeTable changed:', newVal);
    // 可以在这里执行额外的逻辑
});
*/
</script>

<style scoped lang="less">
    .tagmenu {
        display: flex;
        background-color: #dbdbdb;
        overflow: hidden;
        padding: 7px;
        padding-bottom: 2px;
    }
    
    .tabsclass {
        max-width: 1138px;
        flex: 1;

        // 穿刺样式（:deep），用于修改Element Plus组件内部的样式
        :deep(.el-tabs__header) {
            margin: 0;
            border-bottom: none !important;
        }
        
        :deep(.el-tabs__nav) {
            border: 0 !important;
        }

        :deep(.el-tabs__item) {
            background-color: white;
            height: 35px;
            line-height: 35px;
            border-radius: 10px;
            margin-left: 10px;
            border: 0;
        }
    }
    
    // 下拉菜单按钮样式
    .el-dropdown {
        width: 30px;
        height: 35px;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        line-height: 45px;
        margin-left: auto;  // 靠右对齐
        margin-right: 10px;
        cursor: pointer;
    }
</style>