import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 全局导入图标库【此处的as相当于起到别名定义的作用，这是必须的。因为Vue3的组合式API开发大部分开发的选项都是以函数的形式导出】
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// createApp(App).use(router).use(store).use(ElementPlus).mount('#app')
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 应用并挂载到视图内
app.use(router).use(store).use(ElementPlus).mount('#app')