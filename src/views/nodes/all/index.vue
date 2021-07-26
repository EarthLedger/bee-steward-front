<template>
  <div class="userManagement-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
    >
      <el-table-column show-overflow-tooltip type="selection"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="node.addr"
        label="节点地址"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="node.cheque_book_addr"
        label="合约地址"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.node.run_status" style="color: green">
            运行中
          </span>
          <span v-else style="color: red">离线</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="node.connection"
        label="连接数"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="node.depth"
        label="连接深度"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="node.cheque_received_count"
        label="支票数量"
        sortable
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="node.received_cheque_balance"
        label="支票总额"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="max_peer_balance"
        label="MPB"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="node.node_bzz"
        label="节点xBZZ"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="node.node_xdai"
        label="节点xDai"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="node.cheque_bzz"
        label="合约xBZZ"
      ></el-table-column>
      <!--<el-table-column
        show-overflow-tooltip
        prop="cheque_exchanged"
        label="已兑换总额(xBZZ)"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="cheque_rest"
        label="未兑换总额(xBZZ)"
      ></el-table-column>-->
      <el-table-column
        show-overflow-tooltip
        prop="sub_user"
        label="所属子用户"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="node.server_id"
        label="所属集群"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="area"
        label="所在区域"
      ></el-table-column>
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
  import { formatBig } from '@/utils/bigNum'
  import Edit from './components/nodesEdit.vue'

  export default {
    name: 'NodesManagement',
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
          sortField: 'created_by',
          sortDirection: 1,
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      tableSortChange(data) {
        console.log('tableSortChange', data, this.queryForm)
        this.queryForm.sortField = data.prop.split('.')[1]
        this.queryForm.sortDirection = data.order == 'ascending' ? 0 : 1
        this.fetchData()
      },
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
        //const { data, totalCount } = await getList(this.queryForm)
        /*this.list = data
        this.total = totalCount*/
        const { data } = await getList(this.queryForm)
        console.log('result:', data)
        // extract balance info
        data.nodes.forEach((item) => {
          let node = item.node
          item.status = node.run_status == 1 ? '运行中' : '离线'
          // process sub user
          item.sub_user = item.sub ? item.sub.username : '无'
          item.area = '中国区'
          node.received_cheque_balance = formatBig(node.cheque_received_balance)
          let percent = (
            (Number(node.peer_max_postive_balance) / 100000000) *
            100
          ).toFixed(1)
          item.max_peer_balance = `${percent}% ${node.peer_max_postive_balance}`
          node.node_bzz = formatBig(node.node_bzz)
          node.node_xdai = formatBig(node.node_xdai, 18)
          node.cheque_bzz = formatBig(node.cheque_bzz)

          /*if (node.info) {
            node.status = '运行中'
            node.received_cheque_balance = BigInt(0)
            let cheques = []
            node.info.cheques.forEach((cheque) => {
              if (cheque.lastreceived) {
                cheques.push({
                  chequebook: cheque.lastreceived.chequebook,
                  payout: cheque.lastreceived.payout,
                  peer: cheque.peer,
                })
                node.received_cheque_balance += BigInt(
                  cheque.lastreceived.payout
                )
              }
            })
            node.received_cheque_balance = formatBig(
              node.received_cheque_balance
            )

            node.cheque_count = cheques.length
            if (node.info.balances && node.info.balances.length > 0) {
              //node.max_peer_balance = formatBig(node.info.balances[0].balance)
              let balance = node.info.balances[0].balance.toString()
              let percent = ((Number(balance) / 100000000) * 100).toFixed(1)
              node.max_peer_balance = `${percent}% ${balance}`
            }

            node.info.node_xbzz = formatBig(node.info.node_xbzz)
            node.info.node_xdai = formatBig(node.info.node_xdai, 18)
            node.info.chequebook_xbzz = formatBig(node.info.chequebook_xbzz)
          } else {
            node.status = '离线'
          }*/
        })

        this.list = data.nodes
        this.total = data.total

        setTimeout(() => {
          this.listLoading = false
        }, 300)
      },
    },
  }
</script>
