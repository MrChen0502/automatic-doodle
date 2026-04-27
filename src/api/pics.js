// 导入axios封装文件
import request from '@/utils/request'

//获取图片分类接口
export const getPicsCateList = (page, limit = 10) => {
    return request({
        url: `admin/getPicsCateList/${page}`,
        method: 'GET',
        params: {
            limit,
        }
    })
}

// 添加图库分类接口
export const addPicsCateList = (data) => {
    return request({
        url: 'admin/addPicsCateList',
        method: 'POST',
        data
    })
}

// 添加图库分类删除接口
export const deletePicsCateList = (id) => {
    return request({
        url: `admin/delPicsCateList/${id}/delete`,
        method: 'POST',
    })
}

// 修改图库分类接口（根据文档修正）
export const editPicsCateList = (id, data) => {
    return request({
        url: `admin/editPicsList/${id}`,  // URL中包含id
        method: 'POST',
        data

        // : {  // data参数包含 name 和 order
        //     name : data.name,
        //     order : data.order
        // }
    })
}

// 根据分类id获取图片列表缺口
/* id参数：图库分类id;page参数：当前页码;limit参数：每页条数，默认8页 */
export const getPicList = (id, page, limit = 8) => {
    return request({
        url: `admin/getPicList/${id}/image/${page}`,
        method: 'GET',
        params: {
            limit
        }
    })
}

// 重命名图片接口
/* id参数：图片id；name参数：新的图片名称 */
export const editPicName = (id, name) => {
    return request({
        url: `admin/editPicName/${id}`,
        method: 'POST',
        data: {
            name
        }
    })
}

// 删除图片接口
/* ids参数：数组数据，表示一次可以删除多条数据 */
export const delPic = (ids) => {
    return request({
        url: `admin/delPic/delete_all`,
        method: 'POST',
        data: {
            ids
        }
    })
}

// 上传图片接口