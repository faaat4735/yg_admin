import React, { Component } from 'react';
import {
  Button, Form, Layout, Input, message, Select, Upload, Icon, Popconfirm,
} from 'antd';
import TableList from '@tableList';
import Drawer from '@components/draw/draw'
import {
  shuabuVersion,
  shuabuVersionDetail,
} from '@apis/manage';
import { shuabuUrl, shuabuOss } from '@config';

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
    shuabuVersion({ ...this.state.searchKey }, (res) => {
      this.setState({
        listResult: res.data,
      });
      callback && callback();
    });
  }

  handleInfo(id) {
    shuabuVersionDetail({ id: id }, (res) => {
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
    this.props.form.validateFields((error, value) => {
      if (error) { return false; }
      shuabuVersionDetail({ ...value, id: this.state.detailId, action: 'edit' }, () => {
        message.success('操作成功');
        // 新增成功
        let curpage = this.state.searchKey.pageNo;
        if (this.state.detailId == 0 && this.state.listResult && this.state.listResult.totalCount > 0) {
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

  deleteButton = (id) => {
    shuabuVersionDetail({ id: id, action: 'delete' }, () => {
      message.success('删除成功')
      this.getData();
    })
  }

  // 生成表格头部信息
  renderColumn() {
    return [
      {
        title: '版本号',
        dataIndex: 'version_id',
        key: 'version_id',
      },
      {
        title: '版本名称',
        dataIndex: 'version_name',
        key: 'version_name',
      },
      {
        title: '强制更新',
        dataIndex: 'is_force_update',
        key: 'force_update',
        render: text => (text === '1' ? '是' : '否'),
      },
      {
        title: 'apk地址',
        dataIndex: 'version_url',
        key: 'version_url',
        render: text => <a href={`${shuabuOss}${text}`} target="__blank">下载</a>,
      },
      {
        title: '需要更新的版本号',
        dataIndex: 'need_update_id',
        key: 'need_update_id',
      },
      {
        title: '更新日志',
        dataIndex: 'version_log',
        key: 'version_log',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
      },
      {
        title: '操作',
        key: 'operate',
        render: (text, record, index) => (
          <span>
            <span>
              <a onClick={() => this.handleInfo(record.id)}>详情</a>
            </span>
            <Popconfirm title="删除?" onConfirm={() => this.deleteButton(record.id)}>
              <a>删除</a>
            </Popconfirm>
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
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 12 },
    };
    const uploadApp = {
      accept: '.apk',
      name: 'file',
      action: `${shuabuUrl}/admin-base/upload`,
      onChange(info) {
        console.log(info);
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
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
          title={this.state.detailId ? '详情' : '新增'}
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
              <FormItem {...formItemLayout} label="版本名称" hasFeedback>
                {getFieldDecorator('version_name', {
                  initialValue: this.state.detail.version_name || '',
                  rules: [{ required: true, message: '请输入版本名称' }],
                })(<Input placeholder="请输入版本名称" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="是否强制更新" hasFeedback>
                {getFieldDecorator('is_force_update', {
                  initialValue: `${this.state.detail.is_force_update || ''}`,
                  rules: [{ required: true, message: '请选择是否强制更新' }],
                })(<Select placeholder="请选择是否强制更新" size="large" allowClear >
                  {forceUpdateSelect.map(item => <Option value={item.key.toString()} key={item.key.toString()} selected>{item.value}</Option>)}
                </Select>)}
              </FormItem>
              <FormItem {...formItemLayout} label="版本apk" hasFeedback>
                {getFieldDecorator('version_url')(<Upload {...uploadApp}>
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>)}
              </FormItem>
              <FormItem {...formItemLayout} label="需要更新的版本号" hasFeedback>
                {getFieldDecorator('need_update_id', {
                  initialValue: this.state.detail.need_update_id || '',
                })(<Input placeholder="请输入需要更新的版本号" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="更新日志" hasFeedback>
                {getFieldDecorator('version_log', {
                  initialValue: this.state.detail.version_log || '',
                })(<TextArea rows={4} placeholder="请输入更新日志" />)}
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
