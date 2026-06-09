// 导入axios封装文件
import request from '@/utils/request'

// 获取优惠券数据
export const getallcoupon = (page)=>{
    return request({
        url : `admin/coupon/${page}`,
        method : 'GET',
    })
}

// 新增优惠券
export const addcoupon = (data)=>{
    return request({
        url : `/admin/coupon`,
        method : 'POST',
        data,
    })
}

// 编辑优惠券
export const updatecoupon = (id,data)=>{
    return request({
        url : `/admin/coupon/${id}`,
        method : 'POST',
        data,
    })
}

// 删除优惠券
export const deletecoupon = (id)=>{
    return request({
        url : `/admin/coupon/${id}/delete`,
        method : 'POST',
    })
}

// 设置优惠券失效
export const updatestatuscoupon = (id ,  status = 0)=>{
    return request({
        url : `/admin/coupon/${id}/update_status`,
        method : 'POST',
        data : {
            status,
        }
    })
}