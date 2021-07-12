import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/user/list',
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

export function doEdit(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data,
  })
}
