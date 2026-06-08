// 导入axios封装文件
import request from '@/utils/request'


// 获取分销员列表
export const getAgent = (page, type, keyword) => {
    return request({
        url: `admin/agent/${page}`,
        method: 'GET',
        params: {
            type: type,
            keyword: keyword
        }
    })
}

// 查看分销员推广明细
// export const getLookAgent = ()=>{
//     return request({
//         url : `admin/agent/${page}`,
//         method : 'GET'
//     })
// }