<template>
  <div class='notfound'>
    <el-col>
      <el-result icon="error" title="404" sub-title="服务器错误，稍后再试！">
        <template #extra>
          <el-button type="primary" @click="goAdminIndex()">返回首页</el-button>
        </template>
      </el-result>
    </el-col>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// 获取路由实例
const router = useRouter()

// 跳转到后台首页
const goAdminIndex = () => {
  router.push({ name: 'AdminIndex' })  // 跳转到 /adminindex
  // 或者用 router.push('/adminindex')
}
</script>

<style scoped>

</style>