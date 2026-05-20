// 导入axios封装文件
import request from '@/utils/request'

// 获取商品列表
/**
 * page参数：当前页码
 * params参数：地址栏参数，包含以下属性：
    * tab参数：商品类型，all为全部
    * title参数：搜索商品为关键词
    * category_id参数：商品分类ID
    * limit参数：每页条数
 */
export const getGoodsListFn = (page, params) => {
    return request({
        url: `admin/goods/${page}`,
        method: 'GET',
        params,
    })
}

// 获取商品分类
export const getGoodsCategoryFn = () => {
    return request({
        url: `admin/category`,
        method: 'GET',
    })
}

// 新增商品
/** data参数：表单提交过里啊的数据 */
export const InsertGoodFn = (data) => {
    return request({
        url: `admin/goods`,
        method: 'POST',
        data,
    })
}

// 编辑商品
/**
 * id参数：商品ID
 * data参数：表单提交过来的数据
 */
export const editGoodFn = (id, data) => {
    return request({
        url: `admin/goods/${id}`,
        method: 'POST',
        data,
    })
}

// 设置商品轮播图
/**
 * id参数 ：商品ID
 * banners参数 ：选中的图片数组
 */
export const setGoodBannersFn = (id, data) => {
    return request({
        url: `admin/goods/banners/${id}`,
        method: 'POST',
        data,
    })
}

// 根据商品ID获取商品信息
/**id参数：商品ID */
export const getGoodsContentFn = (id) => {
    return request({
        url: `admin/goods/read/${id}`,
        method: 'GET'
    })
}

// 设置商品详情
/**
 * id参数：商品ID
 * content参数：编译器内提交的商品详情内容
 */
export const setGoodContentFn = (id, data) => {
    return request({
        url: `admin/goods/${id}`,
        method: 'POST',
        data,
    })
}

// 设置商品规格（单规格）
/**
 * id参数：商品ID
 * data参数：表单提交过来的数据
 */
export const editGoodSkuFn = (id, data) => {
    return request({
        url: `admin/goods/updateskus/${id}`,
        method: 'POST',
        data,
    })
}

// 新增商品规格选项值
/** data参数：表单提交过来的数据 */
export const insertGoodSkusValFn = (data) => {
    return request({
        url: `admin/goods_skus_card_value`,
        method: 'POST',
        data,
    })
}
// 删除商品规格选项值
export const delGoodSkuFn = (id) => {
    return request({
        url: `admin/goods_skus_card_value/${id}/delete`,
        method: 'POST',
    })
}

// 编辑商品规格选项值
/**
 * id参数：规格ID
 * data参数：表单提交过来的数据
 */
export const editGoodSkusValFn = (id, data) => {
    return request({
        url: `admin/goods_skus_card_value/${id}`,
        method: 'POST',
        data,
    })
}

// 新增商品规格
export const inertGoodSkusFn = (data) => {
    return request({
        url: `admin/goods_skus_card`,
        method: 'POST',
        data,
    })
}

// 编辑商品规格
export const editGoodSkusFn = (id, data) => {
    return request({
        url: `admin/goods_skus_card/${id}`,
        method: 'POST',
        data,
    })
}

// 删除商品规格
export const delGoodSkusFn = (id) => {
    return request({
        url: `admin/goods_skus_card/${id}/delete`,
        method: 'POST',
    })
}

// 批量上架、下架
export const setGoodsStatusFn = (ids, status) => {
    return request({
        url: `admin/goods/changestatus`,
        method: 'POST',
        data,
    })
}

// 批量删除
export const delGoodsAllFn = (ids) => {
    return request({
        url: 'admin/goods/delete_all',
        method: 'POST',
        data: {
            ids,
        }
    })
}

// 批量恢复
export const restoreGoodsFn = (ids) => {
    return request({
        url: 'admin/goods/restore',
        method: 'POST',
        data: {
            ids,
        }
    })
}

// 彻底删除
export const destroyGoodsFn = (ids) => {
    return request({
        url: 'admin/goods/destroy',
        method: 'POST',
        data: {
            ids,
        }
    })
}