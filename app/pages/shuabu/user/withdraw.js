import React, { Component } from 'react';
import {
  Button, Form, Layout, Input, Popconfirm, Select,
} from 'antd';
import TableList from '@tableList';
import Drawer from '@components/draw/draw'
import {
  shuabuWithdraw,
  shuabuWithdrawAction,
} from '@apis/manage';
import { browserHistory } from 'react-router';

const FormItem = Form.Item

const { Content } = Layout;
const { Option } = Select;
@Form.create({})
// 声明组件  并对外输出
export default class app extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props) {
    super(props);
    this.state = {
      searchKey: {
        status: '',
        userId: '',
        pageSize: 10,
        pageNo: 1,
      },
      listResult: {},
      detail: {},
      showReason: false,
      withdraw_id: 0,
      statusSelect: [{ key: 'pending', value: '未审核' }, { key: 'success', value: '审核通过' }, { key: 'failure', value: '审核未通过' }],
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
    shuabuWithdraw({ ...this.state.searchKey }, (res) => {
      this.setState({
        listResult: res.data,
      });
      callback && callback();
    });
  }

  handleSuccess(id) {
    shuabuWithdrawAction({ withdraw_id: id, action: 'success' }, (res) => {
      this.setState({}, () => {
        this.getData();
      });
    });
  }

  handleReson(id) {
    this.setState({ showReason: true, withdraw_id: id });
  }

  handleFailed() {
    this.props.form.validateFields((error, value) => {
      if (error) { return false; }
      shuabuWithdrawAction({ ...value, withdraw_id: this.state.withdraw_id, action: 'failed' }, (res) => {
        this.setState({
          showReason: false,
          withdraw_id: 0,
        }, () => {
          this.getData();
        });
      });
    })
  }

  // 搜索
  handleSearch = (e) => {
    e.preventDefault();
    const status = this.props.form.getFieldValue('status');
    const userId = this.props.form.getFieldValue('user_id');
    this.setState(
      {
        searchKey: {
          ...this.state.searchKey,
          status: status,
          userId: userId,
          pageNo: 1,
        },
      },
      () => {
        this.getData();
      },
    );
  };

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
        title: '提现金额',
        dataIndex: 'withdraw_amount',
        key: 'withdraw_amount',
      },
      {
        title: '提现状态',
        dataIndex: 'withdraw_status',
        key: 'withdraw_status',
      },
      {
        title: '提现账号',
        dataIndex: 'withdraw_account',
        key: 'withdraw_account',
      },
      {
        title: '提现名称',
        dataIndex: 'withdraw_name',
        key: 'withdraw_name',
      },
      {
        title: '用户历史提现金额（元）',
        dataIndex: 'total',
        key: 'total',
      },
      {
        title: '用户历史提现次数',
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: '用户创建时间',
        dataIndex: 'user_time',
        key: 'user_time',
      },
      {
        title: '提现申请时间',
        dataIndex: 'create_time',
        key: 'create_time',
      },
      {
        title: '备注',
        dataIndex: 'withdraw_remark',
        key: 'withdraw_remark',
      },
      {
        title: '操作',
        key: 'operate',
        render: (text, record) => (
          <span>
            <a onClick={() => browserHistory.push(`/shuabu-gold/${record.user_id}`)}>金币明细</a>
            <br />
            {record.withdraw_status === 'pending' ?
              (<span>
                <Popconfirm title="通过?" onConfirm={() => this.handleSuccess(record.withdraw_id)}>
                  <a>通过</a>
                </Popconfirm>
                <span>
                  <a onClick={() => this.handleReson(record.withdraw_id)}>拒绝</a>
                </span>
              </span>) : null}
          </span>
        ),
      },
    ];
  }

  // #endregion

  render() {
    const {
      listResult,
      statusSelect,
    } = this.state;
    // for detail
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 12 },
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
                    <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="提现状态" style={{ width: '200px' }}>
                      {getFieldDecorator('status')(<Select placeholder="All" size="large" allowClear >
                        {statusSelect.map(item => <Option value={item.key.toString()} key={item.key.toString()} selected>{item.key}</Option>)}
                      </Select>)}
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
        {this.state.showReason ? (<Drawer
          visible
          title="拒绝原因"
          onCancel={() => { this.setState({ showReason: false }) }}
          footer={
            <div>
              <Button type="primary" onClick={this.handleFailed.bind(this)}>确定</Button>
              <Button onClick={() => { this.setState({ showDetail: false }) }}>取消</Button>
            </div>}
          className="modal-header modal-body"
        >
          <div className="modalcontent">
            <Form layout="horizontal">
              <FormItem {...formItemLayout} label="拒绝原因" hasFeedback>
                {getFieldDecorator('withdraw_remark')(<Input placeholder="请输入拒绝原因" />)}
              </FormItem>
            </Form>
          </div>
        </Drawer>) : null
        }
      </div>
    );
  }
}
