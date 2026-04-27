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