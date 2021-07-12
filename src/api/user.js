import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: '/user/info',
    method: 'get',
    data: {
      // no need here, if already login, req will append token auto
      // [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'get',
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}
