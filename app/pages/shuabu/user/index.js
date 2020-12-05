import React, { Component } from 'react';
import {
  Button, Form, Layout, Input, message, Select, Upload, Icon, Popconfirm,
} from 'antd';
import TableList from '@tableList';
import { regExpConfig } from '@reg'
import Drawer from '@components/draw/draw'
import {
  shuabuUserList,
  shuabuUserDetail,
  shuabuChangeUserGold,
  shuabuChangeUserStatus,
} from '@apis/manage';
import { browserHistory } from 'react-router';

const FormItem = Form.Item

const { Content } = Layout;
const { Option } = Select
const { TextArea } = Input;

@Form.create({})
// 声明组件  并对外输出
export default class app extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props) {
    super(props);
    this.state = {
      searchKey: {
        pageSize: 10,
        pageNo: 1,
        user_id: 0,
        invited_code: 0,
      },
      listResult: {},
      detail: {},
      showDetail: false,
      changeUserId: 0,
    };
  }

  // 组件即将加载
  componentWillMount() {
    this.setState(() => {
      this.getData();
    });
  }

  // 获取活动列表数据
  getData(callback) {
    shuabuUserList({ ...this.state.searchKey }, (res) => {
      this.setState({
        listResult: res.data,
      });
      callback && callback();
    });
  }

  handleInfo(id) {
    shuabuUserDetail({ id: id }, (res) => {
      this.setState({
        detail: res.data,
        showDetail: true,
      });
    });
  }

  handleChangeGold(id) {
    this.setState({ changeUserId: id });
  }

  handleChange() {
    this.props.form.validateFields((error, value) => {
      if (error) { return false; }
      shuabuChangeUserGold({ ...value, id: this.state.changeUserId }, () => {
        message.success('操作成功');
        this.setState({
          changeUserId: 0,
        }, () => {
          this.getData();
        });
      }, (res) => {
        message.warning(res.msg)
      });
    })
  }

  // 搜索
  handleSearch = (e) => {
    e.preventDefault();
    // eslint-disable-next-line camelcase
    const userId = this.props.form.getFieldValue('user_id');
    const invitedCode = this.props.form.getFieldValue('invited_code');
    this.setState(
      {
        searchKey: {
          ...this.state.searchKey,
          user_id: userId,
          invited_code: invitedCode,
          pageNo: 1,
        },
      },
      () => {
        this.getData();
      },
    );
  };

  handleStatus(id) {
    shuabuChangeUserStatus({ user_id: id }, () => {
      message.success('操作成功');
      this.getData();
    }, (res) => {
      message.warning(res.msg)
    });
  }

  // 页数改变事件
  pageChange = (newPage) => {
    this.state.searchKey.pageNo = newPage;
    this.getData();
  };

  // 页大小改变事件
  pageSizeChange = (e, pageSize) => {
    this.state.searchKey.pageNo = 1;
    this.state.searchKey.pageSize = pageSize;
    this.getData();
  };

  // 生成表格头部信息
  renderColumn() {
    return [
      {
        title: '用户id',
        dataIndex: 'user_id',
        key: 'user_id',
      },
      {
        title: '用户昵称',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: '用户来源',
        dataIndex: 'app_name',
        key: 'app_name',
      },
      {
        title: '金币总数',
        dataIndex: 'total',
        key: 'total',
        render: (text, record) => (<a onClick={() => browserHistory.push(`/shuabu-gold/${record.user_id}`)}>{text}</a>),
      },
      {
        title: '当前金币数',
        dataIndex: 'current',
        key: 'current',
      },
      {
        title: '用户状态',
        dataIndex: 'user_status',
        key: 'user_status',
        render: text => (text === '1' ? '正常' : '冻结'),
      },
      {
        title: '最后登陆时间',
        dataIndex: 'last_login_time',
        key: 'last_login_time',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
      },
    ];
  }

  render() {
    const {
      listResult,
    } = this.state;
    // for detail
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return (
      <div className="page page-scrollfix page-usermanage">
        <Layout>
          <Layout className="page-body">
            <Content>
              <div className="page-header">
                <div className="layout-between">
                  <Form className="flexrow" onSubmit={this.handleSearch}>
                    <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="用户Id" style={{ width: '200px' }}>
                      {getFieldDecorator('user_id')(<Input />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="用户邀请码" style={{ width: '200px' }}>
                      {getFieldDecorator('invited_code')(<Input />)}
                    </FormItem>
                    <Button type="primary" htmlType="submit">
                      搜索
                    </Button>
                  </Form>
                </div>
              </div>
              <div className="page-content has-pagination table-flex table-scrollfix">
                <TableList
                  rowKey={(record, index) => index}
                  columns={this.renderColumn()}
                  dataSource={listResult.list}
                  currentPage={this.state.searchKey.pageNo}
                  pageSize={this.state.searchKey.pageSize}
                  onChange={this.pageChange}
                  onShowSizeChange={this.pageSizeChange}
                  totalCount={listResult.totalCount}
                />
              </div>
            </Content>
          </Layout>
        </Layout>
        {this.state.showDetail ? (<Drawer
          visible
          title="详情"
          onCancel={() => { this.setState({ showDetail: false }) }}
          footer={
            <div>
              <Button onClick={() => { this.setState({ showDetail: false }) }}>关闭</Button>
            </div>}
          className="modal-header modal-body"
        >
          <div className="modalcontent">
            <Form layout="horizontal">
              <FormItem {...formItemLayout} label="用户来源" >
                {getFieldDecorator('app_name', {
                  initialValue: this.state.detail.app_name,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="设备Id" >
                {getFieldDecorator('device_id', {
                  initialValue: this.state.detail.device_id,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="用户昵称" >
                {getFieldDecorator('nickname', {
                  initialValue: this.state.detail.nickname,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="手机号" >
                {getFieldDecorator('phone_number', {
                  initialValue: this.state.detail.phone_number,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="签到天数" >
                {getFieldDecorator('check_in_days', {
                  initialValue: this.state.detail.check_in_days,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="金币总数" >
                {getFieldDecorator('totalGold', {
                  initialValue: this.state.detail.totalGold,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="冻结金币数" >
                {getFieldDecorator('bolckedGold', {
                  initialValue: this.state.detail.bolckedGold,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="当前金币数" >
                {getFieldDecorator('currentGold', {
                  initialValue: this.state.detail.currentGold,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="支付宝账号" >
                {getFieldDecorator('alipay_account', {
                  initialValue: this.state.detail.alipay_account,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="支付宝账号名称" >
                {getFieldDecorator('alipay_name', {
                  initialValue: this.state.detail.alipay_name,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="身份证号码" >
                {getFieldDecorator('id_card', {
                  initialValue: this.state.detail.id_card,
                })(<Input disabled />)}
              </FormItem>
              {this.state.detail.openid ? (<div>
                <FormItem {...formItemLayout} label="openid（微信）" >
                  {getFieldDecorator('openid', {
                    initialValue: this.state.detail.openid,
                  })(<Input disabled />)}
                </FormItem>
                <FormItem {...formItemLayout} label="语言（微信）" >
                  {getFieldDecorator('language', {
                    initialValue: this.state.detail.language,
                  })(<Input disabled />)}
                </FormItem>
                <FormItem {...formItemLayout} label="性别（微信）" >
                  {getFieldDecorator('sex', {
                    initialValue: this.state.detail.sex,
                  })(<Input disabled />)}
                </FormItem>
                <FormItem {...formItemLayout} label="省份（微信）" >
                  {getFieldDecorator('province', {
                    initialValue: this.state.detail.province,
                  })(<Input disabled />)}
                </FormItem>
                <FormItem {...formItemLayout} label="城市（微信）" >
                  {getFieldDecorator('city', {
                    initialValue: this.state.detail.city,
                  })(<Input disabled />)}
                </FormItem>
                <FormItem {...formItemLayout} label="国家（微信）" >
                  {getFieldDecorator('country', {
                    initialValue: this.state.detail.country,
                  })(<Input disabled />)}
                </FormItem>
                <FormItem {...formItemLayout} label="头像（微信）" >
                  {getFieldDecorator('headimgurl', {
                    initialValue: this.state.detail.headimgurl,
                  })(<Input disabled />)}
                </FormItem></div>) : null}
              <FormItem {...formItemLayout} label="unionid" >
                {getFieldDecorator('unionid', {
                  initialValue: this.state.detail.unionid,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="VAID" >
                {getFieldDecorator('VAID', {
                  initialValue: this.state.detail.VAID,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="AAID" >
                {getFieldDecorator('AAID', {
                  initialValue: this.state.detail.AAID,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="OAID" >
                {getFieldDecorator('OAID', {
                  initialValue: this.state.detail.OAID,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="brand" >
                {getFieldDecorator('brand', {
                  initialValue: this.state.detail.brand,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="model" >
                {getFieldDecorator('model', {
                  initialValue: this.state.detail.model,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="SDKVersion" >
                {getFieldDecorator('SDKVersion', {
                  initialValue: this.state.detail.SDKVersion,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="AndroidId" >
                {getFieldDecorator('AndroidId', {
                  initialValue: this.state.detail.AndroidId,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="IMEI" >
                {getFieldDecorator('IMEI', {
                  initialValue: this.state.detail.IMEI,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="MAC" >
                {getFieldDecorator('MAC', {
                  initialValue: this.state.detail.MAC,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="邀请码" >
                {getFieldDecorator('invited_code', {
                  initialValue: this.state.detail.invited_code,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="最后登陆时间" >
                {getFieldDecorator('last_login_time', {
                  initialValue: this.state.detail.last_login_time,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...formItemLayout} label="创建时间" >
                {getFieldDecorator('create_time', {
                  initialValue: this.state.detail.create_time,
                })(<Input disabled />)}
              </FormItem>
            </Form>
          </div>
        </Drawer>)
          : null
        }
        {this.state.changeUserId ? (<Drawer
          visible
          title="修改金币"
          onCancel={() => { this.setState({ changeUserId: 0 }) }}
          footer={
            <div>
              <Button onClick={() => this.handleChange()}>确定</Button>
              <Button onClick={() => { this.setState({ changeUserId: 0 }) }}>关闭</Button>
            </div>}
          className="modal-header modal-body"
        >
          <Form>
            <FormItem {...formItemLayout} label="修改类型" hasFeedback>
              {getFieldDecorator('change_type', {
                initialValue: 'in',
                rules: [{ required: true, message: '请选择修改类型' }],
              })(<Select placeholder="请选择修改类型" size="large" allowClear >
                <Option value="in" key="in" >加</Option>
                <Option value="out" key="out" >减</Option>
              </Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label="修改金币数" >
              {getFieldDecorator('change_gold', { rules: [{ required: true, message: '请输入修改金币数' }, { pattern: regExpConfig.gold, message: '请输入1-4位数字' }] })(<Input placeholder="请输入修改金币数" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="修改原因" >
              {getFieldDecorator('change_remark')(<Input placeholder="请输入修改原因" />)}
            </FormItem>
          </Form>
        </Drawer>) : null}
      </div>
    );
  }
}
