// 导入axios封装文件
import request from '@/utils/request'

// 获取分类数据
export const getGoodsList = (page, params) => {
    return request({
        url: `/admin/goods/${page}`,
        method: 'GET',
        params,
    })
}

// 添加分类