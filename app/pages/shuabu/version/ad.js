import React, { Component } from 'react';
import {
  Button, Form, Layout, Input, message, Select, Upload, Icon, Popconfirm,
} from 'antd';
import TableList from '@tableList';
import Drawer from '@components/draw/draw'
import {
  shuabuVersionAd,
  shuabuVersionAdDetail,
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
      adStatusList: [{ key: 1, value: '开启' }, { key: 0, value: '关闭' }],
      //      fileList:[]
    };
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
    shuabuVersionAd({ ...this.state.searchKey }, (res) => {
      this.setState({
        listResult: res.data,
      });
      callback && callback();
    });
  }

  add() {
    this.setState({ detail: {}, showDetail: true });
  }

  handleSubmit() {
    this.props.form.validateFields((error, value) => {
      if (error) { return false; }
      shuabuVersionAdDetail({ ...value, action: 'add' }, () => {
        message.success('操作成功');
        // 新增成功
        let curpage = this.state.searchKey.pageNo;
        if (this.state.listResult && this.state.listResult.totalCount > 0) {
          curpage = Math.floor(this.state.listResult.totalCount / this.state.searchKey.pageSize) + 1;
        }
        this.setState({
          showDetail: false,
          searchKey: {
            ...this.state.searchKey,
            pageNo: curpage,
          },
          detail: {},
        }, () => {
          this.getData();
        });
      }, (res) => {
        message.warning(res.msg)
      });
    })
  }

  handleChange(id, name) {
    shuabuVersionAdDetail({ version_id: id, app_name: name, action: 'change' }, () => {
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
        title: '版本号',
        dataIndex: 'version_id',
        key: 'version_id',
      },
      {
        title: '渠道号',
        dataIndex: 'app_name',
        key: 'app_name',
      },
      {
        title: '是否屏蔽广告（点击修改）',
        dataIndex: 'ad_status',
        key: 'ad_status',
        render: (text, record) => (
          <span>
            <span>
              <a onClick={() => this.handleChange(record.version_id, record.app_name)}>{text === '1' ? '开启' : '关闭'}</a>
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
      adStatusList,
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
              <div className="page-footer">
                <div className="page-footer-buttons">
                  <Button
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={() => this.add()}
                  >
                    {' '}
                      添加版本
                  </Button>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
        {this.state.showDetail ? (<Drawer
          visible
          title="新增"
          onCancel={() => { this.setState({ showDetail: false }) }}
          footer={
            <div>
              <Button type="primary" onClick={this.handleSubmit.bind(this)}>确定</Button>
              <Button onClick={() => { this.setState({ showDetail: false }) }}>取消</Button>
            </div>}
          className="modal-header modal-body"
        >
          <div className="modalcontent">
            <Form layout="horizontal">
              <FormItem {...formItemLayout} label="版本号" hasFeedback>
                {getFieldDecorator('version_id', {
                  initialValue: this.state.detail.version_id || '',
                  rules: [{ required: true, message: '请输入版本号' }],
                })(<Input placeholder="请输入版本号" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="渠道号" hasFeedback>
                {getFieldDecorator('app_name', {
                  initialValue: this.state.detail.app_name || '',
                  rules: [{ required: true, message: '请输入渠道号' }],
                })(<Input placeholder="请输入渠道号" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="是否屏蔽广告" hasFeedback>
                {getFieldDecorator('ad_status', {
                  initialValue: `${this.state.detail.ad_status || ''}`,
                  rules: [{ required: true, message: '请选择是否强制更新' }],
                })(<Select placeholder="请选择是否强制更新" size="large" allowClear >
                  {adStatusList.map(item => <Option value={item.key.toString()} key={item.key.toString()} selected>{item.value}</Option>)}
                </Select>)}
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
