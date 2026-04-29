import request from '@/utils/request'

// 获取管理员列表
/** page:页码; limit: 每页条数; keyword: 搜索关键词 */
export const getManager = (page, limit = 8, keyword = '') => {
    return request({
        url: `admin/manager/${page}`,
        method: 'GET',
        params: {
            limit,
            keyword
        }
    })
}

// 添加管理员
export const getaddManager = (data)=>{
    return request({
        url : 'admin/manager',
        method : 'POST',
        data,
    })
}


// 编辑管理员
/** id参数：管理员ID；data参数：提交过来的修改管理员表单数据 */
export const EditManager = (id , data)=>{
    return request({
        url : `admin/manager/${id}`,
        method : 'POST',
        data
    })
}

// 删除管理员
export const DeleteManager = (id)=>{
    return request({
        url : `admin/manager/${id}/delete`,
        method : 'POST',
    })
}