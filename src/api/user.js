// 导入axios封装文件
import request from '@/utils/request'

// 用户数据
export const getUserData = (params = {}) => {
    return request({
        url: 'admin/user/1',
        method: 'GET',
        params: params  // 关键：要把参数传进去
    })
}


// 新增用户
export const postUserData = (data) => {
    return request({
        url: 'admin/user',
        method: 'POST',
        data,
    })
}

