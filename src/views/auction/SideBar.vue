<template>
  <div class="sidebar-container">
    <div class="selecte-group">
      <span>简单资产</span>
      <el-radio-group v-model="radio">
        <el-radio v-model="radio" label="1-1">GPK卡</el-radio>
        <el-radio v-model="radio" label="1-2">GPK卡</el-radio>
        <el-radio v-model="radio" label="1-3">GPK卡</el-radio>
        <el-radio v-model="radio" label="1-4">GPK卡</el-radio>
        <el-radio v-model="radio" label="1-5">GPK卡</el-radio>
        <el-radio v-model="radio" label="1-6">GPK卡</el-radio>
      </el-radio-group>
    </div>
    <div class="selecte-group">
      <span>游戏装备</span>
      <el-radio-group v-model="radio">
        <el-radio v-model="radio" label="2-1">GPK卡</el-radio>
        <el-radio v-model="radio" label="2-2">GPK卡</el-radio>
        <el-radio v-model="radio" label="2-3">GPK卡</el-radio>
        <el-radio v-model="radio" label="2-4">GPK卡</el-radio>
        <el-radio v-model="radio" label="2-5">GPK卡</el-radio>
        <el-radio v-model="radio" label="2-6">GPK卡</el-radio>
      </el-radio-group>
    </div>
    <div class="selecte-group">
      <span>加密艺术</span>
      <el-radio-group v-model="radio">
        <el-radio v-model="radio" label="3-1">GPK卡</el-radio>
        <el-radio v-model="radio" label="3-2">GPK卡</el-radio>
        <el-radio v-model="radio" label="3-3">GPK卡</el-radio>
        <el-radio v-model="radio" label="3-4">GPK卡</el-radio>
        <el-radio v-model="radio" label="3-5">GPK卡</el-radio>
        <el-radio v-model="radio" label="3-6">GPK卡</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: '1-1',
    };
  },
};
</script>

<style lang="less">
.sidebar-container {
  width: 230px;
  padding: 20px 0px;
  background-color: #ffffff;
  .selecte-group {
    margin-left: 30px;
  }
  .el-radio-group {
    display: flex;
    flex-direction: column;
    margin: 10px;
  }
}
</style>
