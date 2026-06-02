<template>
    <div class='adminindex'>
      <!-- 整体页面，默认上下结构 -->
      <el-container class="container">
        <el-header>
        <header-com></header-com>
        </el-header>

        <!-- 头部以为的剩余空间结构，默认为左右结构 -->
        <el-container>
          <!-- <else-aside :width="$store.state.isCollapse ? '65px' : '200px'"></else-aside> -->
          <el-aside width="200px">
            <MenuCom />
          </el-aside>

          <el-main>
            <!-- 标签栏 -->
             <TagMenus/>
             <!-- 路由展示区 -->
            <router-view v-slot="{ Component }">
              <keep-alive :max="8">
                <component :is="Component"></component>
              </keep-alive>
            </router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>

<script setup>
// setup函数内，导入的子组件不需要注册，导入即注册
import HeaderCom from '../components/HeaderCom.vue';
import MenuCom from '../components/MenuCom.vue';
import TagMenus from '../components/TagMenus.vue';
</script>

<style scoped>
.adminindex{
  height: 100vh;
  overflow: hidden;
  /* background-color: palegoldenrod; */
}
.container{
  height: 100%;
  /* background-color: pink; */
  background-color: #1AA094;

}
.el-header{
  background-color: #1AA094;
}
.el-aside{
  background-color: #1AA094;
}
.el-main{
  width: 100%;
  height: 98vh;
  overflow: hidden;
  background-color: #f2f4f5;
}

</style>