<template>
     <div class="login-all">
    <div class="login-left">
    <!-- 这个class="left-content"使得div的display: flex不会生效 -->
    <div class="left-content">
        <h1>Vite+Vue3商城管理系统</h1>
        <h3>技术支持:陈钢浩</h3>
      </div>
    </div>
    <div class="login-right">
      <div class="app1">
        <h3>登录</h3>
        <el-input v-model="input" style="margin-top: 50px;" placeholder="请输入用户名"></el-input>
        <el-input placeholder="请输入密码" style="margin-top: 50px;" v-model="password" show-password></el-input>
        <el-button type="success" style="margin-top: 50px;">成功按钮</el-button>
      </div>
    </div>
  </div>
  </template>
  
  <script>
    export default {
    data() {
        return {
        input: '',
        password: ''
        }
    }
    }
  </script>
  
  <style scoped>
  .login-all{
    display: flex;
    height: 100vh;
  }

  .login-left{
    flex: 1;
    background-color: rgb(64, 175, 226);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .left-content{
    color: white;
  }

  .login-right{
    flex: 1;
    background-color: rgb(218, 72, 218);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .app1{
    width: 80%;
    h3{
        color: white;
    }
  }
  </style>