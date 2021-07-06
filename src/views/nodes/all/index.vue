<template>
  <div class="userManagement-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      @selection-change="setSelectRows"
    >
      <el-table-column show-overflow-tooltip type="selection"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="address"
        label="节点地址"
      ></el-table-column>
      <el-table-column show-overflow-tooltip prop="status" label="运行状态">
        <template #default="{ row }">
          <el-tag v-for="(item, index) in row.status" :key="index">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="connections"
        label="连接数"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="cheque_received_count"
        label="支票数量"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="cheque_balance_total"
        label="支票总额"
      ></el-table-column>
      <el-table-column show-overflow-tooltip prop="sub_user" label="所属子用户">
        <template #default="{ row }">
          <el-tag v-for="(item, index) in row.sub_user" :key="index">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="权限">
        <template #default="{ row }">
          <el-tag v-for="(item, index) in row.permissions" :key="index">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        show-overflow-tooltip
        prop="datatime"
        label="修改时间"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="200">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <edit ref="edit" @fetch-data="fetchData"></edit>
  </div>
</template>

<script>
  import { getList } from '@/api/node'
  import Edit from './components/nodesEdit.vue'

  export default {
    name: 'UserManagement',
    components: { Edit },
    data() {
      return {
        list: null,
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 20,
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.id) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const { data, totalCount } = await getList(this.queryForm)
        this.list = data
        this.total = totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
