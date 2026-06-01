// 存放所有跟商品有关的数据和方法

import { computed, nextTick, ref } from "vue";
import {
  insertGoodSkusValFn,
  delGoodSkuFn,
  inertGoodSkusFn,
  delGoodSkusFn,
  editGoodSkusValFn,
  editGoodSkusFn
} from "./goods";
import ElMessage from "element-plus/es/components/message/index.mjs";

// 导出当前商品ID
export const goodID = ref(0);
// 当前商品的规格列表
export const skuList = ref([]);
// 定义接收商品已经完成设置的规格数据数组
export const skuTable = ref([])

// 添加加载状态
export const isLoading = ref(false);

// 初始化商品规格列表函数
export function initSkuListFn(goodinfo) {
  console.log(goodinfo);

  // 从商品数据中遍历剥离出规格数据
  skuList.value = goodinfo.goodsSkusCard.map((item) => {
    // 在原有的item基础上，新增一个text属性
    item.text = item.name;
    // 再次循环，将每个规格名称下的属性提取出来
    item.goodsSkusCardValue.map((val) => {
      val.text = val.value || "属性值";
      return val;
    });
    return item;
  });
  console.log(goodinfo.goodsSkusCard);
  console.log(goodinfo.goods_skus_card_id);
  console.log(skuList);
  // 初始化表格数据
  skuTable.value = goodinfo.goodsSkus;
}

// 初始化商品规格
export function initSkuItemVal(id) {
  // tag数组
  let tagList = skuList.value.find((val) => val.id == id);
  // 控制输入或点击按钮
  let inputVisiable = ref(false);
  // 获取输入框的内容
  let inputVal = ref("");
  // 获取输入框的DOM元素
  let inputRef = ref();

  let Loading = ref(false);

  // 新增规格选项值
  const InputBlur = async () => {
    Loading.value = true;
    // 判断是否输入框为空
    if (inputVal.value == "" || inputVal.value == null) {
      ElMessage.error('规格选项值不可为空!')
      Loading.value = false;
      return
    };
    let obj = {
      goods_skus_card_id: id,
      name: tagList.name,
      order: 2,
      value: inputVal.value,
    };
    Loading.value = true;
    // 调用接口，请求数据
    let result = await insertGoodSkusValFn(obj);
    if (result.msg != "ok" || !result.data) {
      return
    };
    ElMessage.success('添加成功')
    Loading.value = false;


    // 添加成功，同步视图数据
    tagList.goodsSkusCardValue.push({ ...result.data, text: inputVal.value });
    inputVisiable.value = false;
    inputVal.value = "";
  };

  // 删除规格选项值
  /** tag:接收要删除的数据 */
  const deleteTag = async (tag) => {
    Loading.value = true;
    let result = null;
    try {
      result = await delGoodSkuFn(tag.id);
      if (result.msg != "ok" || !result.data) return;
      const index = tagList.goodsSkusCardValue.findIndex(
        (item) => item.id === tag.id,
      );
      if (index !== -1) {
        tagList.goodsSkusCardValue.splice(index, 1);
        ElMessage.success('移除成功')
      }
    } finally {
      Loading.value = false
    }
  };

  // 修改规格选项值
  /** val参数：当前标签对象，tag：当前数据 */
  const editTag = async (val, tag) => {
    // 整理需要提交给接口的参数数据
    let obj = {
      goods_skus_card_id: tag.goods_skus_card_id,   //当前选项所属的规格ID
      name: tag.name,                               //规格名称
      order: tag.order,                             //当前规格选项的顺序值
      value: val                                    //输入框的最新内容
    }
    let id = tag.id                                  //规格选项ID
    Loading.value = true;
    // 调用编辑选项值的接口
    try {
      let result = await editGoodSkusValFn(id, obj);
      console.log("需要编辑的数据：" + result);
      if (result.msg != 'ok' || !result.data) {
        // 保留原来的内容并显示在输入框内
        tag.text = tag.value
        return
      }
      tag.value = val;
    } finally {
      Loading.value = false;
    }
  };

  // 控制文本框与按钮的显示
  const showInput = () => {
    inputVisiable.value = true;
    nextTick(() => {
      inputRef.value.input.focus();
    });
  };

  return {
    tagList,
    inputVisiable,
    inputVal,
    inputRef,
    Loading,
    InputBlur,
    deleteTag,
    editTag,
    showInput,
  };
}

// 添加规格（添加一个新的规格行）
export const addSku = async (parentId = 0) => {
  const lastItem = skuList.value[skuList.value.length - 1];
  if (
    lastItem &&
    (lastItem.text === "规格名称" || lastItem.text.trim() === "")
  ) {
    ElMessage.warning("请先填写规格名称/标签,才能继续添加新的商品规格");
    return; // 直接返回，不执行新增
  }

  isLoading.value = true;

  // 1. 构造临时数据对象
  let obj = {
    goods_id: goodID.value,             //商品ID
    name: "规格名称",                   //规格名称
    order: skuList.value.length + 1,   //排序
    type: 1,                           //类型
  };

  let result = null;
  try {
    // 2. 调用后端接口插入新的规格
    result = await inertGoodSkusFn(obj);
    if (!result.data || result.msg != 'ok') return;
  } finally {
    isLoading.value = false;
  }


  // 3. 同步到前端视图
  let newItem = {
    id: result.data.id,
    name: result.data.name,
    text: result.data.name,
    goodsSkusCardValue: [],
  };

  skuList.value.push(newItem);
};

// 删除规格（删除一个规格行）
export const deleteSku = async (id) => {
  isLoading.value = true;
  let result = null;
  try {
    result = await delGoodSkusFn(id);
    if (result.msg != "ok" || !result.data) return;
    const index = skuList.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      skuList.value.splice(index, 1);
    }
  } finally {
    isLoading.value = false;
  }
};

// 编辑规格    val参数：整个当前的规格数据
export const editSkuData = async (val)=>{
  isLoading.value = true;
  let obj = {
    goods_id: goodID.value,             //商品ID
    name: val.text,                   //规格名称
    order: val.order,   //排序
    type: val.type,                           //类型
  };
  let result = null; 
  try{
    // 请求数据
    result = await editGoodSkusFn( val.id , obj );

    if(result.msg != 'ok' || !result.data){
      val.text = val.name;
      ElMessage.error('修改失败')
      return
    }

    // 同步视图
    val.name = val.text
    ElMessage.success('修改成功')
  } finally {
    isLoading.value = false;
  }
}

// 初始化规格表格数据(过滤规格选项中空白的数据)
export function initTableData(){
  // 如果规格内没有设置属性值，那么不孕系显示在表格内
  let isSkuVal = computed(()=>{
    // 将规格数组skuList内goodsSkuCardValue的长度为0的数据过滤掉===>不显示在表格内
    return skuList.value.filter((item)=> item.goodsSkusCardValue.length != 0)
  })
  // 根据goodsSkus的数据，需要重新编辑表格结构
  let tableTitle = computed(()=>{
    // 根据有效的规格数组来确定“商品规格”标题需要横向合并多少个单元格
    let tabLen = isSkuVal.value.length;
    // 整理列标题
    let titleArr = [
      // 如果只有一个规格且只有一个属性（尺码：均码），商品规格只需要保留原标题即可，不需要分裂
      {name:'商品规格',col:tabLen,row:tabLen>0 ? 1 : 2},
      {name:'市场价',row:2},
      {name:'销售价',row:2},
      {name:'成本价',row:2},
      {name:'库存',row:2},
      {name:'商品体积',row:2},
      {name:'商品重量',row:2},
      {name:'编码',row:2},
    ]


    return titleArr
  })

  return{
    tabLen,
    titleArr
  }
}

