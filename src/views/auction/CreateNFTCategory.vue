<template>
  <div class="form-content">
    <el-form :model="form" label-width="100px">
      <el-form-item label="元数据">
        <div>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="总发行量">
        <el-input v-model="form.totalSupply"></el-input>
      </el-form-item>
      <el-form-item label="说明">
        <el-input type="textarea" :rows="4" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="form-btn">
          <el-button type="primary" @click="handleCreateNFTCategory">创建</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        orginData: '', // 元数据
        totalSupply: 0, // 总发行量
        desc: '', // 说明
      },
    };
  },
  methods: {
    handleCreateNFTCategory() {
      console.log('handleCreateNFTCategory');
      this.$message.success('创建成功');
      this.$router.push('/');
    },
  },
};
</script>

<style lang="less">
.form-content {
  background-color: #fff;
  width: 700px;
  margin: 0 auto;
  padding: 30px;
  .form-btn {
    display: flex;
    justify-content: center;
  }
  .el-input {
    width: 400px;
  }
}
</style>
