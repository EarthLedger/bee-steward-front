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
  console.log('user create/edit:', data)
  // create or update
  if (data.id) {
    // update
    return request({
      url: `/user/${data.id}/update`,
      method: 'post',
      data: {
        username: data.username,
        password: data.password,
        role: 'sub',
      },
    })
  } else {
    // create
    return request({
      url: '/user/create',
      method: 'post',
      data: {
        username: data.username,
        password: data.password,
        role: 'sub',
      },
    })
  }
}

export function doDelete(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data,
  })
}
