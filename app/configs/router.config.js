import React from 'react'
import { Router, Route, IndexRoute, browserHistory/* , Redirect */ } from 'react-router'
// browserHistory
import { isLogin } from '@configs/common'

import * as base from '@pages/base' // 基础
import * as shuabu from '@pages/shuabu' // 刷步多多

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={base.app} onEnter={isLogin}>
      <IndexRoute component={shuabu.report} />
      {/* 走路多多 */}
      <Route path="/shuabu-index" component={shuabu.report} />
      <Route path="/shuabu-list" component={shuabu.user} />
      <Route path="/shuabu-activity" component={shuabu.activity} />
      <Route path="/shuabu-version" component={shuabu.version} />
      <Route path="/shuabu-ad" component={shuabu.ad} />
      <Route path="/shuabu-withdraw" component={shuabu.withdraw} />
      <Route path="/shuabu-user" component={shuabu.user} />
      <Route path="/shuabu-config/:type" component={shuabu.config} />
      <Route path="/shuabu-gold/:id" component={shuabu.gold} />
      <Route path="/shuabu-version-ad" component={shuabu.versionAd} />
      <Route path="/shuabu-feedback" component={shuabu.feedback} />
      <Route path="/shuabu-sdk-error" component={shuabu.sdkError} />
      <Route path="/shuabu-invited" component={shuabu.invited} />
    </Route>
    <Route path="/login" component={base.login} />
    <Route path="*" component={base.notfound} />
  </Router>
)
