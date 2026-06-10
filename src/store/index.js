import { createStore } from 'vuex'
import { getUserInfoFn } from '../api/login'

//导入
import createPersistedState from 'vuex-persistedstate'

// 创建实例
export default createStore({
    // state: 存放数据的地方
    state(){
        return{
            // 定义管理员信息变量
            userInfo: [],  // 用户信息放这里
            menus : [],       //存储权限菜单
            isCollapse : false,   //false默认展开菜单,true折叠菜单  
        }
    },
    
    // 同步函数
    // mutations: 修改数据的方法
    mutations: {
        // 初始化修改变量的函数 —— 当登录成功，互殴去管理员信息后将组件的组件的数据赋值给state的变量
        // state是当前store的存储数据空间对象；data是组件传递过来的数据
        insertUserInfoFn(state, data) {
            state.userInfo = data;  // 把用户信息存进去
            console.log(state.userInfo);
        },
        clearUserInfo(state) {
            state.userInfo = {};  // 清空用户信息
            console.log('已清空用户信息');
        },
          //向共享空间存储管理员权限菜单
          insertMenusFn( state , data ){
            state.menus = data;
            console.log(data);        
        },
        //初始化修改isCollapse
        updateIsCollapse(state){
            state.isCollapse = ! state.isCollapse
        },
    },
    // 异步函数
    // actions: 调用接口获取数据
    actions: {
        ActionGetUserInfo(context) {
            return new Promise((resolve, reject) => {
                getUserInfoFn().then(res => {
                    let obj = {
                        id: res.data.id,
                        username: res.data.username,
                        avatar: res.data.avatar,
                        super: res.data.super,
                        role: res.data.role,
                    }
                    context.commit('insertUserInfoFn', obj)
                    context.commit('insertMenusFn', res.data.menus)
                }).catch(err => reject(err))
            })
        }
    },
    
    // getters: 获取数据的方法（相当于计算属性）
    getters: {
        userName: (state) => {
            // 从用户信息里取出用户名
            return state.userInfo?.username || 'Admin'
        },
        userAvatar: (state) => {
            // 从用户信息里取出头像
            return state.userInfo?.avatar || '默认头像地址'
        }
    },
    // 添加持久化插件配置
    plugins: [
        createPersistedState({
            key: 'vuex-store',           // localStorage 中存储的键名
            paths: ['userInfo', 'menus'], // 需要持久化的状态
            storage: window.localStorage, // 使用 localStorage
            })
        ]
})