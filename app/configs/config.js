
export const set = 'set$'
export const brandName = 'yongGui' // slogan

// 开发环境默认配置
// 当前后台地址
let _baseURL = 'http://localhost:8001'
// 后台接口
let _adminUrl = 'http://localhost:8003'
// 计步宝接口
let _shuabuURL = 'http://localhost:8003'

if (process.env.NODE_ENV === 'production') {
  _baseURL = 'http://www.shyonggui.com:8010'
  _adminUrl = 'http://shuabu.shyonggui.com:8003'
  _shuabuURL = 'http://shuabu.shyonggui.com:8003'
} else if (process.env.NODE_ENV === 'qa') {
  _baseURL = 'http://test.shyonggui.com:8001'
  _adminUrl = 'http://test.shyonggui.com:8003'
  _shuabuURL = 'http://test.shyonggui.com:8003'
}

export const path = ''
export const timeout = '15000' // 接口超时限制(ms)
export const baseURL = _baseURL
export const adminUrl = _adminUrl
export const shuabuURL = _shuabuURL
// 刷步多多oss
export const shuabuOss = 'https://oss.shyonggui.com/'
