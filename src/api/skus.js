// 导入axios封装文件
import request from '@/utils/request'


//  * 获取规格列表

export const getSkuListFn =(page)=> {
  return request({
    url: `/admin/skus/${page}`,
    method: 'get'
  })
}


//  * 新增商品规格

export const addSku =(data)=> {
  return request({
    url: '/admin/skus',
    method: 'post',
    data
  })
}


//  * 编辑商品规格

export const updateSku =(id, data)=> {
  return request({
    url: `/admin/skus/${id}`,
    method: 'post',
    data
  })
}


//  * 删除和批量删除商品规格

export const deleteSkus =(ids)=> {
  return request({
    url: '/admin/skus/delete_all',
    method: 'post',
    data: { ids }
  })
}