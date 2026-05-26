// 存放所有跟商品有关的数据和方法

import { nextTick, ref } from "vue";
import { insertGoodSkusValFn, delGoodSkuFn } from "./goods";

// 导出当前商品ID
export const goodID = ref(0);
// 当前商品的规格列表
export const skuList = ref([]);

// 初始化商品规格列表函数
export function initSkuListFn(goodinfo) {
    console.log(goodinfo);

    // 从商品数据中遍历剥离出规格数据
    skuList.value = goodinfo.goodsSkusCard.map(item => {
        // 在原有的item基础上，新增一个text属性
        item.text = item.name
        // 再次循环，将每个规格名称下的属性提取出来
        item.goodsSkusCardValue.map(val => {
            val.text = val.value || '属性值';
            return val;
        })
        return item;
    })
    console.log(skuList);
}

// 初始化商品规格
export function initSkuItemVal(id) {
    // tag数组
    let tagList = skuList.value.find(val => val.id == id);
    // 控制输入或点击按钮
    let inputVisiable = ref(false);
    // 获取输入框的内容
    let inputVal = ref('');
    // 获取输入框的DOM元素
    let inputRef = ref();

    // 新增规格选项值
    const InputBlur = async () => {
        // 判断是否输入框为空
        if (inputVal.value == '' || inputVal.value == null) return;
        let obj = {
            goods_skus_card_id: id,
            name: tagList.name,
            order: 2,
            value: inputVal.value
        }
        // 调用接口，请求数据
        let result = await insertGoodSkusValFn(obj);
        if (result.msg != 'ok' || !result.data) return;

        // 添加成功，同步视图数据
        tagList.goodsSkusCardValue.push({ ...result.data, text: inputVal.value })
        inputVisiable.value = false;
        inputVal.value = '';
    }

    // 删除规格选项值
    /** tag:接收要删除的数据 */
    const deleteTag = async (tag) => {
        console.log(tag.id);
        let result = await delGoodSkuFn(tag.id)

        if (result.msg != 'ok' || !result.data) return;

        const index = tagList.goodsSkusCardValue.findIndex(item => item.id === tag.id);
        if (index !== -1) {
            tagList.goodsSkusCardValue.splice(index, 1);
        }
    }

    // 修改规格选项值
    /** val参数：当前标签对象，tag：当前数据 */
    const editTag = async (val, tag) => {

    }

    // 控制文本框与按钮的显示
    const showInput = () => {
        inputVisiable.value = true;
        nextTick(() => {
            inputRef.value.input.focus()
        })
    }

    return {
        tagList,
        inputVisiable,
        inputVal,
        inputRef,
        InputBlur,
        deleteTag,
        editTag,
        showInput
    }
} 
