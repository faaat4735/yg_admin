
import { createApi } from '@ajax'
import { baseURL, /* baseURL, */ path, adminUrl } from '@config'

const prefix = 'usercenter'
const option = { baseURL: baseURL }

export const login = createApi(`${adminUrl}/admin/base/login`) // 登陆
export const logout = createApi(`${adminUrl}/admin/base/logout`) // 登出
export const staff = createApi(`${adminUrl}/admin/base/userInfo`) // 用户信息
export const menu = createApi(`${adminUrl}/admin/base/menu`) // 菜单

export const loginByTicket = createApi(`${path}/${prefix}/loginByTicket`, option) // 通过ticket登陆
export const loginByKey = createApi(`${path}/service/pagerservice/checkKey`, option) // 通过key进入项目
export const synUser = createApi(`${path}/${prefix}/user/synUser`, option);// 同步用户

// export const menu = createApi(`${path}/${prefix}/user/userMenu`, option) // 获取菜单
export const getLevel = createApi(`${path}/${prefix}/user/getLevel`, option) // 当前用户的等级
export const getBtns = createApi(`${path}/${prefix}/resource/listByPid`, option) // 获取菜单id
export const getAllRetrieval = createApi(`${path}/data/sys/retrieval/queryAllRetrievald`) // 获取gForm2.0头部搜索
