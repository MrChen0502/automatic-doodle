// 导入axios
import request from '@/utils/request'

// 后台首页订单数据统计
export const getOrderState = () => {
    return request({
        url: 'admin/orderState',
        method: 'GET'
    })
}

// 后台首页Echarts数据请求
export const getEchartsData = (type) => {
    return request({
        url: 'admin/echartsData',
        method: "GET",
        params: {
            type
        }
    })
}

// 后台店铺订单数据统计请求
export const getGoodsState = () => {
    return request({
        url: 'admin/goodsState',
        method: "GET"
    })
}
