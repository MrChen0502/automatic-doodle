// 修改密码模块

// 导入请求函数
import { editPassword } from "@/api/login";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";

// 导出并创建修改密码函数
export function userEditPassword() {
  let dialogEditPwd = ref(false); //控制修改密码对话框的显示(true)隐藏(false)数据

  let ruleFormDom = ref(null);

  // 表单数据
  const editPwdForm = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });

  const ruleForm = reactive({
    oldpassword: [
      { required: true, message: "请输入旧密码！！！", trigger: "blur" },
    ],
    password: [
      { required: true, message: "请输入新密码！！！", trigger: "blur" },
    ],
    repassword: [
      { required: true, message: "请再次输入新密码！！！", trigger: "blur" },
    ],
  });

  const EditPwd = async (type) => {
    if (type == "cancel") {
      // 取消操作
      dialogEditPwd.value = false;
      ElMessage.info("已取消修改");
    } else if (type == "confirm") {
      if (editPwdForm.oldpassword == "") {
        ElMessage.error("请输入旧密码！！！");
        return;
      }
      if (editPwdForm.password == "") {
        ElMessage.error("请输入新密码！！！");
        return;
      }
      if (editPwdForm.repassword == "") {
        ElMessage.error("请再次输入新密码！！！");
        return;
      }

      ruleFormDom.value.validate((valid) => {
        if (valid) {
          // 检查两次密码是否一致
          if (editPwdForm.password !== editPwdForm.repassword) {
            ElMessage.error("两次输入的新密码不一致！");
            return;
          }

          ElMessage.success("修改成功");
          dialogEditPwd.value = false;
          // 清空表单
        }
      });
      // 确认修改操作
      if (!ruleFormDom.value) return;

      // 调用请求函数
      const res = await editPassword(editPwdForm);
      console.log(res);
    }
  };
  // 返回应用的变量和函数
  return {
    dialogEditPwd,
    ruleFormDom,
    editPwdForm,
    ruleForm,
    EditPwd,
  };
}
