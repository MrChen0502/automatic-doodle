// 导入axios封装文件
import request from '@/utils/request'

// 初始化并导出登录函数
// data参数是用户在表单中填写的登录账号以及密码数据
export const LoginFn = (data) => {
    // 调用request请求并返回请求结果
    return request({
        // 请求地址
        url: 'admin/login',
        // 请求方式：不写则默认为GET
        method: 'POST',
        // 请求传递的数据，一般仅在POST/PUT方式下使用
        // data : 'data'
        data,
    })
}

// 根据token获取管理员信息
export const getUserInfoFn = () => {
    return request({
        // 请求地址
        url: 'admin/getUserInfo',
        // 请求方式：不写则默认为GET
        method: 'POST',
    })
}


// 修改管理员密码
export const editPassword = (data) => {
    return request({
        url: 'admin/editPassword',
        method: 'POST',
        data,
    })
}


