import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/node/list',
    method: 'post',
    data: {
      page: {
        current: data.pageNo,
        size: data.pageSize,
      },
      order: undefined,
    },
  })
}
