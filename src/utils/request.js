// 导入axios
import axios from "axios";
// 导入ElMessage
import { ElMessage } from "element-plus";
// // 导入Element的加载中动画
// import { ElLoading } from "element-plus";
// let loadingAni = null;

// 创建axios实例对象
const instance = axios.create({
    // 设置项目基准地址(服务器地址)
    baseURL: '/api',
    // 设置请求超时时间为20秒
    timeout: 30000
})

// 设置请求拦截器:将Header属性的token携带拼接到此处
instance.interceptors.request.use(config => {
    // // 开启进度条
    // loadingAni = ElLoading.service({
    //     lock : true,
    //     text : 'Loading',
    //     background : 'rgba( 0.5 , 0.5 , 0.5 , 0.5 )',
    // })
    // 从sessionStorage提取token
    const token = sessionStorage.getItem('token');
    // 判断：是否有token/是否提取toekn成功
    if (token) {
        // 从拦截器的配置中提取header属性，新建一个token下标，并将会话存储中提取的token值赋值过去
        config.headers['token'] = token
    }
    return config;
})

// 设置请求响应器
instance.interceptors.response.use(response => {
    // // 关闭进度条
    // loadingAni.close();
    // 正常数据返回
    return response.data;
}, err => {
    // 安全返回 + 错误提示
    if (err.response) {
        // 有响应，返回错误数据
        const message = err.response.data?.message || '请求失败';
        ElMessage.error(message);
        return Promise.reject(err.response.data);
    } else {
        // 无响应（网络问题）
        ElMessage.error('网络连接失败');
        return Promise.reject({ code: 500, message: '网络错误' });
    }
})

// 导出
export default instance;