<template>
    <div class='menucom'>
        <!-- 设置启动路由模式;设置默认选中效果为当前路由访问地址 -->
        <el-menu :router="true" :default-active='defaultActive' popper-class='background-color: #1AA094'  :unique-opened="true" :collapse="$store.state.isCollapse">
            <!-- 单独设置后台路径和菜单栏 -->
             <el-menu-item  index="/admin/index">
                <el-icon><House /></el-icon>
                <span>后台首页</span>
            </el-menu-item>
            <!-- 1.v-for渲染数据; 2.判断id=5时不需要此条数据渲染；3.index属性的动态设置 -->
             <template v-for="(item,index) in menusDataCom" :key="index">
                <el-sub-menu  v-if="item.id != 5" :index='item.id+""' :key='item.id'>
                <template #title>
                    <el-icon>
                        <!-- ElementPlus的图标是作为组件使用的,所以动态使用图标相当于动态切换组件 -->
                        <component :is='item.icon'></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </template>
                <!-- 二级菜单区域 -->
                <el-menu-item v-for='subItem in item.child' :index="'/admin'+subItem.frontpath" :key='subItem.id'>
                    <template #title>
                        <el-icon>
                            <component :is="subItem.icon"></component>
                        </el-icon>
                        <span>{{ subItem.name }}{{ subItem.frontpath }}</span>
                    </template>
                </el-menu-item>
            </el-sub-menu>
             </template>
            
        </el-menu>
    </div>
</template>

<script setup>
//导入应用Store函数，从Vuex模块
import { useStore } from 'vuex'
//导入计算属性computed以及响应式函数ref
import { computed, ref } from 'vue'
//导入应用路由函数
import { useRouter } from 'vue-router'

//初始化常量
const store = useStore();
const router = useRouter();

//利用计算属性的自动执行且可作为视图变量
let menusDataCom = computed(() => {
    //返回Vuex中的state的属性数据
    return store.state.menus || []  // 确保返回数组
})

//设置当前路由地址为默认选择的index
let defaultActive = ref(router.currentRoute.value.path)
</script>

<style scoped lang="less">
    :deep(div.el-sub-menu__title){
        color: white;
        background-color: #1AA094;
    }
    :deep(li.el-menu-item){
        color: white;
        background-color: #1AA094;
    }
</style>