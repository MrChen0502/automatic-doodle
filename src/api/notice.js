// 导入axios封装文件
import request from '@/utils/request'


// 获取新闻公告列表
export const allnotice = (page)=>{
    return request({
        url : `admin/news/${page}`,
        method : 'GET',
    })
}


// 新增公告
export const addnotice = (data)=>{
    return request({
        url : `/admin/news`,
        method : 'POST',
        data
    })
}

// 编辑公告
export const updatenotice = (id,data)=>{
    return request({
        url : `/admin/news/${id}`,
        method : 'POST',
        data,
    })
}

// 删除新闻公告
export const deletenotice = (id)=>{
    return request({
        url : `/admin/news/${id}/delete`,
        method : 'POST',
    })
}