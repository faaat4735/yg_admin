import React, { Component } from 'react';
import {
  Button, Form, Layout, Input, message, Select, Upload, Icon, Popconfirm,
} from 'antd';
import TableList from '@tableList';
import Drawer from '@components/draw/draw'
import {
  shuabuConfig,
  shuabuConfigDetail,
} from '@apis/manage';

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
      },
      listResult: {},
      detail: {},
      showDetail: false,
      detailId: 0,
      forceUpdateSelect: [{ key: 1, value: '是' }, { key: 0, value: '否' }],
      //      fileList:[]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // 组件即将加载
  componentWillMount() {
    this.setState(() => {
      this.getData();
    });
  }

  // 组件已经加载到dom中
  //  componentDidMount() {
  //    this.props.form.setFieldsValue({ key: '' });
  //  }

  // 获取活动列表数据
  getData(callback) {
    shuabuConfig({ ...this.state.searchKey, type: this.props.params.type }, (res) => {
      this.setState({
        listResult: res.data,
      });
      callback && callback();
    });
  }

  handleInfo(id) {
    console.log(this)
    shuabuConfigDetail({ id: id }, (res) => {
      this.setState({
        detail: res.data,
        showDetail: true,
        detailId: id,
      });
    });
  }

  add() {
    this.setState({ detail: {}, showDetail: true, detailId: 0 });
  }

  handleSubmit() {
    console.log(this)
    this.props.form.validateFields((error, value) => {
      if (error) { return false; }
      shuabuConfigDetail({ ...value, id: this.state.detailId, action: 'edit', type: this.props.params.type }, () => {
        message.success('操作成功');
        // 新增成功
        let curpage = this.state.searchKey.pageNo;
        if (this.state.detailId === 0 && this.state.listResult && this.state.listResult.totalCount > 0) {
          curpage = Math.floor(this.state.listResult.totalCount / this.state.searchKey.pageSize) + 1;
        }
        this.setState({
          showDetail: false,
          searchKey: {
            ...this.state.searchKey,
            pageNo: curpage,
          },
          detailId: 0,
          detail: {},
        }, () => {
          this.getData();
        });
      }, (res) => {
        message.warning(res.msg)
      });
    })
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
        title: '签到天数',
        dataIndex: 'counter_min',
        key: 'counter_min',
      },
      {
        title: '奖励最小值',
        dataIndex: 'award_min',
        key: 'award_min',
      },
      {
        title: '奖励最大值',
        dataIndex: 'award_max',
        key: 'award_max',
      },
      {
        title: '操作',
        key: 'operate',
        render: (text, record, index) => (
          <span>
            <span>
              <a onClick={() => this.handleInfo(record.config_id)}>详情</a>
            </span>
          </span>
        ),
      },
    ];
  }

  // #endregion

  render() {
    const {
      listResult,
      forceUpdateSelect,
    } = this.state;
    // for detail
    const { getFieldDecorator } = this.props.form
    const { type } = this.props.params
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 12 },
    };
    let counterMin = null;
    switch (type) {
      case 'sign':
        counterMin = (<FormItem {...formItemLayout} label="签到天数" hasFeedback>
          {getFieldDecorator('counter_min', {
            initialValue: this.state.detail.counter_min || '',
          })(<Input disabled />)}
        </FormItem>);
        break;
      case 'walk':
        counterMin = (<FormItem {...formItemLayout} label="步数奖励次数" hasFeedback>
          {getFieldDecorator('counter_min', {
            initialValue: this.state.detail.counter_min || '',
            rules: [{ required: true, message: '请输入步数奖励次数' },
              { pattern: /^\d+$/, message: '请输入整数' }],
          })(<Input placeholder="请输入步数奖励次数" />)}
        </FormItem>);
        break;
      case 'walk_stage':
        counterMin = (<FormItem {...formItemLayout} label="步数阶段奖励步数" hasFeedback>
          {getFieldDecorator('counter_min', {
            initialValue: this.state.detail.counter_min || '',
          })(<Input disabled />)}
        </FormItem>);
        break;
      default:
        return null;
    }

    return (
      <div className="page page-scrollfix page-usermanage">
        <Layout>
          <Layout className="page-body">
            <Content>
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
              {type === 'walk' ?
                (<div className="page-footer">
                  <div className="page-footer-buttons">
                    <Button
                      type="primary"
                      style={{ marginRight: '10px' }}
                      onClick={() => this.add()}
                    >
                      {' '}
                        添加步数奖励次数
                    </Button>
                  </div>
                </div>) : null}
            </Content>
          </Layout>
        </Layout>
        {this.state.showDetail ? (<Drawer
          visible
          title={this.state.detailId ? '详情' : '新增'}
          onCancel={() => { this.setState({ showDetail: false }) }}
          footer={
            <div>
              {/* eslint-disable-next-line react/jsx-no-bind */}
              <Button type="primary" onClick={this.handleSubmit}>确定</Button>
              <Button onClick={() => { this.setState({ showDetail: false }) }}>取消</Button>
            </div>}
          className="modal-header modal-body"
        >
          <div className="modalcontent">
            <Form layout="horizontal">
              {counterMin}
              <FormItem {...formItemLayout} label="奖励最小值" hasFeedback>
                {getFieldDecorator('award_min', {
                  initialValue: this.state.detail.award_min || '',
                  rules: [{ required: true, message: '请输入奖励最小值' },
                    { pattern: /^\d+$/, message: '请输入整数' }],
                })(<Input placeholder="请输入奖励最小值" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="奖励最大值" hasFeedback>
                {getFieldDecorator('award_max', {
                  initialValue: this.state.detail.award_max || '',
                  rules: [{ required: true, message: '请输入奖励最大值' },
                    { pattern: /^\d+$/, message: '请输入整数' }],
                })(<Input placeholder="请输入奖励最大值" />)}
              </FormItem>
            </Form>
          </div>
        </Drawer>)
          : null
        }
      </div>
    );
  }
}
