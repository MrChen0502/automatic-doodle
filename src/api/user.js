// 导入axios封装文件
import request from '@/utils/request'

// 用户数据
export const getUserData = () => {
    return request({
        url: 'admin/user/1',
        method: 'GET',
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

