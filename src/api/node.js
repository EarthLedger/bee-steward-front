import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/nodes',
    method: 'post',
    data,
  })
}
