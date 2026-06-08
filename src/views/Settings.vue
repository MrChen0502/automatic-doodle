<template>
    <el-card>
        <div class="settings">
            <h3>基础设置</h3>
            <el-form>
                <el-form-item label="分销启用">
                    <el-radio-group v-model="radio1">
                        <el-radio :value="1" border>是</el-radio>
                        <el-radio :value="0" border>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="分销海报">
                    <el-upload class="avatar-uploader"
                        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" list-type="picture-card"
                        :auto-upload="false">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
        </div>
        <div class="settings">
            <el-form>
                <h3>佣金设置</h3>
                <el-form-item label="一级返佣比例">
                    <el-input>
                        <template #append>%</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="二级返佣比例">
                    <el-input>
                        <template #append>%</template>
                    </el-input>
                </el-form-item>
            </el-form>

        </div>
        <div class="settings">
            <el-form>
                <h3>结算设置</h3>
                <el-form-item label="结算时间">
                    <el-input>
                        <template #append>天</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="结算方式">
                    <el-radio-group class="Settlement" v-model="radio2">
                        <el-radio :value="1" border>手动结算</el-radio>
                        <el-radio :value="0" border>微信结算</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>

        <div>
            <el-button type="primary">保存</el-button>
        </div>

    </el-card>
</template>

<script setup>
import { ref } from 'vue';



let radio1 = ref('')

let radio2 = ref('')
</script>

<style scoped>
.el-card {
    margin-top: 15px;
    height: calc(98vh - 120px);

    .el-form-item {
        margin-left: 50px;

        .avatar-uploader {
            display: flex;
            justify-content: center;
            font-size: 40px;
            border: 1px solid rgb(221, 221, 221);
            cursor: pointer;
        }
    }

    .el-button {
        width: 100px;
        margin-left: 118px;
    }
}
</style>