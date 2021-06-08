const totalCount = 3
const List = [
  {
    address: '0x76222BDCb13E1E5E3b41bb94Accf32e5Bd095361',
    status: ['健康'],
    connections: 100,
    cheque_received_count: 8,
    cheque_balance_total: 0.125636,
    sub_user: ['u1'],
  },
  {
    address: '0x76222BDCb13E1E5E3b41bb94Accf32e5Bd095361',
    status: ['健康'],
    connections: 100,
    cheque_received_count: 8,
    cheque_balance_total: 0.125636,
    sub_user: ['u1'],
  },
  {
    address: '0x76222BDCb13E1E5E3b41bb94Accf32e5Bd095361',
    status: ['维护中'],
    connections: 1010,
    cheque_received_count: 81,
    cheque_balance_total: 1.25636,
    sub_user: ['u2'],
  },
]
module.exports = [
  {
    url: '/nodes',
    type: 'post',
    response(config) {
      const { title = '', pageNo = 1, pageSize = 20 } = config.body
      const pageList = List.filter(
        (item, index) =>
          index < pageSize * pageNo && index >= pageSize * (pageNo - 1)
      )
      return {
        code: 200,
        msg: 'success',
        totalCount,
        data: pageList,
      }
    },
  },
  {
    url: '/userManagement/doEdit',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟保存成功',
      }
    },
  },
  {
    url: '/userManagement/doDelete',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: '模拟删除成功',
      }
    },
  },
]
