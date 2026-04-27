import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 导入path模块
import path from 'path'  // 1. 添加这行

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  // 设置@的访问路径
  resolve: {  // 2. 添加 resolve 配置
    alias: {
      '@': path.resolve(__dirname, './src')  // 3. 配置 @ 指向 src
    }
  },
  // 设置启动跨域处理
  server : {
    proxy : {
      // 将第三方域名别名化处理
      '/api' : {
        target : 'http://api.jjcto.com/',
        changeOrigin : true,
        rewrite : (path) => path.replace(/^\/api/,'')
      }
    }
  }
})