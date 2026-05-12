// 导入axios封装文件
import request from '@/utils/request'


// 获取订单数据
export const getOrder = (params = {}) => {
    // 从 params 中解构出 page, tab 和其他参数
    const { page = 1, tab = 'all', ...queryParams } = params

    return request({
        url: `admin/order/${page}?tab=${tab}`,
        method: 'GET',
        params: queryParams
    })
}

// 批量删除订单
export const deleteOrders = (ids) => {
    return request({
        url: 'admin/order/delete_all',
        method: 'POST',
        data: {
            ids: ids
        }
    })
}

// 导出订单列表
export const exportOrders = (params = {}) => {
    const { tab = 'all', ...queryParams } = params

    return request({
        url: `admin/order/excelexport?tab=${tab}`,
        method: 'POST',
        params: queryParams, 
        responseType: 'blob'
    })
}