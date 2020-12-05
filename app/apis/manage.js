
import { createApi } from '@ajax'
import { shuabuUrl } from '@config'


// 走路多多 开始
export const shuabuReport = createApi(`${shuabuUrl}/admin/index/list`); // 获取报表数据
// // 用户
export const shuabuUserList = createApi(`${shuabuUrl}/admin/user/list`); // 获取用户列表
export const shuabuUserDetail = createApi(`${shuabuUrl}/admin/user/detail`); // 获取用户详情
export const shuabuChangeUserGold = createApi(`${shuabuUrl}/admin/user/change-gold`); // 修改用户金币
export const shuabuGold = createApi(`${shuabuUrl}/admin/user/gold`); // 获取用户金币明细
export const shuabuChangeUserStatus = createApi(`${shuabuUrl}/admin/user/change-status`); // 获取用户金币明细
export const shuabuFeedback = createApi(`${shuabuUrl}/admin/user/feedback`); // 获取用户反馈
export const shuabuInvited = createApi(`${shuabuUrl}/admin/user/invited`); // 获取用户邀请明细
export const shuabusdkError = createApi(`${shuabuUrl}/admin/sdk/list`); // 获取三方错误码
// // 活动
export const shuabuActivity = createApi(`${shuabuUrl}/admin/activity/list`) // 获取活动列表
export const shuabuActivityDetail = createApi(`${shuabuUrl}/admin/activity/detail`) // 获取活动详情
export const shuabuActivityDetailUpdate = createApi(`${shuabuUrl}/admin/activity/detail`) // 添加，更新活动详情
export const shuabuConfig = createApi(`${shuabuUrl}/admin/activity/config`)
export const shuabuConfigDetail = createApi(`${shuabuUrl}/admin/activity/config-detail`)
// // 版本管理
export const shuabuVersion = createApi(`${shuabuUrl}/admin/version/list`) // 获取版本列表
export const shuabuVersionDetail = createApi(`${shuabuUrl}/admin/version/detail`) // 获取版本列表
export const shuabuVersionAd = createApi(`${shuabuUrl}/admin/version/adList`) // 获取版本列表
export const shuabuVersionAdDetail = createApi(`${shuabuUrl}/admin/version/adDetail`) // 获取版本列表
// // 运营位管理
export const shuabuAd = createApi(`${shuabuUrl}/admin/ad/list`)
export const shuabuAdDetail = createApi(`${shuabuUrl}/admin/ad/detail`)
// // 提现管理
export const shuabuWithdraw = createApi(`${shuabuUrl}/admin/withdraw/list`)
export const shuabuWithdrawAction = createApi(`${shuabuUrl}/admin/withdraw/action`)
// 走路多多 结束

