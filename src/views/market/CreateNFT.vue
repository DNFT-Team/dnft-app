<template>
  <div class="form-content">
    <el-form :model="form" label-width="100px">
      <el-form-item label="元数据">
        <div>
          <el-upload
            action="/hack"
            :auto-upload="false"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="类别哈希">
        <el-select v-model="form.categoryHash" placeholder="请选择">
          <el-option
            v-for="item in categoryList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="说明">
        <el-input type="textarea" :rows="4" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model.number="form.price"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="form-btn">
          <el-button :loading="loading" type="primary" @click="handleCreateNFT">创建</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading:false,
      form: {
        metaData: 'ipfs.io/ipfs/QmRVxd8dRDa2bTD3tm4teT7XEdSHozo9na1EGswLmFtYpU', // 元数据
        desc: '', // 说明
        categoryHash: '',
        price: ''
      },
      categoryList:[]
    };
  },
  mounted(){
    this.getList()
  },
  methods: {
    async getList(){
      this.categoryList = await this.$Nft.Category_IdList() || []
    },
    handleCreateNFT() {
      this.loading = true
      this.$Nft.NFT_Add(
        this.form,
        (res)=>{
          this.loading = false
          if(res.code === 0){
            this.$message.success('创建成功');
            this.$router.push({ name: 'market' });
          }
        }
      )
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
