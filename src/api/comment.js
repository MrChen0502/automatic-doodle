// 导入axios封装文件
import request from '@/utils/request'

// 1. 获取商品评论列表
export const getproductreviews = (page , title)=>{
    return request({
        url : `admin/goods_comment/${page}`,
        method : 'GET',
        params : {
            title
        }
    })
}

// 2. 回复/修改商品评价
export function replyComment(id, data) {
    return request({
      url: `/admin/goods_comment/review/${id}`,
      method: 'post',
      data: { data } 
    })
  }
  
  // 3. 是否显示商品评论
  export function updateCommentStatus(id, status) {
    return request({
      url: `/admin/goods_comment/${id}/update_status`,
      method: 'post',
      data: { status }  // status: 0 不显示, 1 显示
    })
  }