<template>
  <div>
    <!--面包屑导航-->
    <div class="crumbs">
    </div>

    <!--内容-->
    <div class="container">
      <!--筛选框-->
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
          <el-option key="1" label="广东省" value="广东省" />
          <el-option key="2" label="湖南省" value="湖南省" />
        </el-select>
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" />
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>

      <!--表格-->
      <el-table ref="multipleTable" stripe :data="data" border class="table" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" fixed align="center" />
        <el-table-column label="操作" width="150" fixed="left" align="center">
          <template slot-scope="scope">
            <!-- 不能点击 disabled -->
            <el-button type="button" class="el-button el-button--danger el-button--mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button type="button" class="el-button el-button--default el-button--mini" @click="handleEdit(scope.$index, scope.row)"><span>编辑</span></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="序号" width="50" align="center" />
        <el-table-column prop="date" label="日期" sortable width="110" />
        <el-table-column prop="name" label="姓名" width="80">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>姓名: {{ scope.row.name }}</p>
              <p>住址: {{ scope.row.address }}</p>
              <div slot="reference" class="name-wrapper">
                <el-link size="medium" :underline="false">{{ scope.row.name }}</el-link>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column prop="num" label="数字" align="right" width="130" />
        <el-table-column prop="jz" label="净值" align="right" width="130" />
        <el-table-column prop="jz" label="净值" align="right" width="130" />
        <el-table-column prop="empty" label="返回为空" align="center" width="100" :formatter="empty" />
        <el-table-column prop="card" label="身份证号" width="190" />
        <el-table-column prop="address" label="地址" width="400" :formatter="formatter" />
        <el-table-column prop="time" label="时间" width="180" />
      </el-table>
      <!--分页容器 -->
      <div class="pagination">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="30" @current-change="handleCurrentChange" />
      </div>
      <!--Tab 切换-->
      <div style="margin-bottom:40px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
          <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
          <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
        </el-tabs>
      </div>
      <!--选择日期-->
      <div class="block" style="margin-bottom:40px;">
        <span class="demonstration" style="padding-right:10px;font-size: 14px;">选择日期</span>
        <el-date-picker v-model="data1" type="date" placeholder="选择日期" />
        <span class="demonstration" style="padding: 0 10px;font-size: 14px;">选择日期时间</span>
        <el-date-picker v-model="data2" type="datetime" placeholder="选择日期时间" />
      </div>
      <!--Button 按钮-->
      <el-row style="margin-bottom:40px;">
        <el-button>默认按钮</el-button>
        <el-button type="primary">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
      </el-row>
      <!--加载中-->
      <el-row style="margin-bottom:40px;">
        <el-button type="primary" :loading="true">加载中</el-button>
      </el-row>
      <!--默认按钮大小-->
      <el-row style="margin-bottom:40px;">
        <el-button>默认按钮</el-button>
        <el-button size="medium">中等按钮</el-button>
        <el-button size="small">小型按钮</el-button>
        <el-button size="mini">超小按钮</el-button>
      </el-row>
      <!--Link 文字链接-->
      <div class="link_cont" style="margin-bottom:40px;">
        <el-link href="#" target="_blank">默认链接</el-link>
        <el-link type="primary">主要链接</el-link>
        <el-link type="success">成功链接</el-link>
        <el-link type="warning">警告链接</el-link>
        <el-link type="danger">危险链接</el-link>
        <el-link type="info">信息链接</el-link>
        <el-link :underline="false">无下划线</el-link>
        <el-link>有下划线</el-link>
        <el-link icon="el-icon-edit">编辑</el-link>
        <el-link>查看<i class="el-icon-view el-icon-right" /></el-link>
      </div>
    </div>
  </div>
</template>

<script>
  import { fetchData } from '../../api/index';
  export default {
    name: 'DemoPage',
    data() {
      return {
        data1: '',
        data2: '',
        activeName: 'second',
        tableData: [],
        cur_page: 1,
        multipleSelection: [],
        select_cate: '',
        select_word: '',
        del_list: [],
        is_search: false,
        editVisible: false,
        delVisible: false,
        form: {
          name: '',
          date: '',
          num: '',
          bfb: '',
          address: ''
        },
        idx: -1,
        id: -1
      };
    },
    computed: {
      data() {
        return this.tableData.filter((d) => {
          let isDel = false;
          for (let i = 0; i < this.del_list.length; i++) {
            if (d.name === this.del_list[i].name) {
              isDel = true;
              break;
            }
          }
          if (!isDel) {
            if (d.address.indexOf(this.select_cate) > -1 &&
              (d.name.indexOf(this.select_word) > -1 ||
              d.address.indexOf(this.select_word) > -1)
            ) {
              return d;
            }
          }
        });
      }
    },
    created() {
      this.getData();
    },
    methods: {
      handleClick(tab, event) {
      },
      // 分页导航
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getData();
      },
      // 获取 easy-mock 的模拟数据
      getData() {
        fetchData({
          page: this.cur_page
        }).then((res) => {
          this.tableData = res.list;
        });
      },
      search() {
        this.is_search = true;
      },
      formatter(row, column) {
        return row.address;
      },
      empty() {
        return '-';// 为空显示
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      handleEdit(index, row) {
        this.idx = index;
        this.id = row.id;
        this.form = {
          id: row.id,
          name: row.name,
          date: row.date,
          num: row.num,
          bfb: row.bfb,
          address: row.address
        };
        this.editVisible = true;
      },
      handleDelete(index, row) {
        this.idx = index;
        this.id = row.id;
        this.delVisible = true;
      },
      delAll() {
        const length = this.multipleSelection.length;
        let str = '';
        this.del_list = this.del_list.concat(this.multipleSelection);
        for (let i = 0; i < length; i++) {
          str += this.multipleSelection[i].name + ' ';
        }
        this.$message.error('删除了' + str);
        this.multipleSelection = [];
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 保存编辑
      saveEdit() {
        this.editVisible = false;
        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
        if (this.tableData[this.idx].id === this.id) {
          this.$set(this.tableData, this.idx, this.form);
        } else {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].id === this.id) {
              this.$set(this.tableData, i, this.form);
              return;
            }
          }
        }
      },
      // 确定删除
      deleteRow() {
        this.$message.success('删除成功');
        this.delVisible = false;
        if (this.tableData[this.idx].id === this.id) {
          this.tableData.splice(this.idx, 1);
        } else {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].id === this.id) {
              this.tableData.splice(i, 1);
              return;
            }
          }
        }
      }
    }
  };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
    .link_cont a.is-underline{
      display: inline-block;
      margin: 0 10px!important;
    }
</style>
