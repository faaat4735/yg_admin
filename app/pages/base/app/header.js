
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { Menu, Dropdown, Button, Modal, message, Icon, Row, Col } from 'antd'
import { brandName } from '@config'
import { logout } from '@apis/common'
// import User from '@images/user.png'

const { confirm } = Modal

@connect((state, props) => ({
  config: state.config,
  staffResponse: state.staffResponse,
}))
export default class Header extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props)
    this.state = {
      loading: false,
    }
    this.handleLogout = this.handleLogout.bind(this)
  }

  // 组件已经加载到dom中
  componentDidMount() {

  }

  // 登出
  handleLogout() {
    const { config } = this.props
    const self = this
    confirm({
      title: '提示',
      content: '确认退出登录吗？',
      onOk() {
        logout({}, (result) => {
          // console.log(result)
          if (result.status === 'ok') {
            sessionStorage.clear()
            config.staff = {}
            browserHistory.push('/login')
          } else {
            message.warning(result.msg)
          }
        })
      },
    })
  }

  logoClick = () => {
    // const nav = JSON.parse(sessionStorage.getItem('gMenuList'))
    // if (nav[0] && nav[0].children && nav[0].children[0].children && nav[0].children[0].children[0] && nav[0].children[0].children[0].resKey) {
    //   browserHistory.push(nav[0].children[0].children[0].resKey)
    //   sessionStorage.setItem('topMenuReskey', nav[0].resKey)
    // }
    // if (nav[0] && nav[0].children && nav[0].children[0].resKey) {
    //   browserHistory.push(nav[0].children[0].resKey)
    // } else {
    //   browserHistory.push('/')
    // }
    // console.log(nav)
    // browserHistory.push()
  }

  render() {
    const name = 'Admin'
    const { gMenuList, topMenuReskey } = this.props
    const topKey = topMenuReskey
    return (
      <header id="navbar">
        <div id="navbar-container" className="boxed">
          <Row className="row">
            <Col span={20}>
              <div className="navbar-brand" title={brandName} onClick={this.logoClick}>
                <span className="brand-title">
                  <span className="brand-text"><span className="logo" />{brandName}</span>
                </span>
              </div>
              <nav className="topMenus hide">
                {
                  gMenuList && gMenuList.map((item, index) => (<span
                    className={item.resKey === topKey ? 'topMenu on' : 'topMenu'}
                    key={index}
                    onClick={() => this.props.topMenuClick(item, index)}
                  >{item.resName}</span>))
                }
              </nav>
            </Col>
            <Col span={4} className="col">
              <div className="right">
                <ul>
                  <li>
                    {name}
                  </li>
                  <li>
                    <a onClick={this.handleLogout}>退出</a>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
      </header>
    )
  }
}
