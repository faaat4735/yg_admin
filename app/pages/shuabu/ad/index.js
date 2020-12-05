import React, { Component } from 'react';
import {
  Button, Form, Layout, Input, message, Select, Upload, Icon,
} from 'antd';
import TableList from '@tableList';
import Drawer from '@components/draw/draw'
import {
  shuabuAd,
  shuabuAdDetail,
} from '@apis/manage';
import { shuabuUrl, shuabuOss } from '@config';

const FormItem = Form.Item

const { Content } = Layout;
const { Option } = Select
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
      forceUpdateSelect: [{ key: 1, value: '上线' }, { key: 0, value: '下线' }],
      validityTypeSelect: [{ key: 'fixed', value: '固定' }, { key: 'limit', value: '限时' }],
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
    shuabuAd({ ...this.state.searchKey }, (res) => {
      this.setState({
        listResult: res.data,
      });
      callback && callback();
    });
  }

  handleInfo(id) {
    shuabuAdDetail({ id: id }, (res) => {
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
      shuabuAdDetail({ ...value, id: this.state.detailId, action: 'edit' }, () => {
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

  // 生成表格头部信息
  // change
  renderColumn() {
    return [
      {
        title: '名称',
        dataIndex: 'advertise_name',
        key: 'advertise_name',
      },
      {
        title: '副标题',
        dataIndex: 'advertise_subtitle',
        key: 'advertise_subtitle',
      },
      {
        title: '类型',
        dataIndex: 'advertise_type',
        key: 'advertise_type',
      },
      {
        title: '图片',
        dataIndex: 'advertise_image',
        key: 'advertise_image',
        // eslint-disable-next-line jsx-a11y/alt-text
        render: text => (text ? <img className="auto_img" src={`${shuabuOss}${text}`} /> : ''),
      },
      {
        title: '跳转链接',
        dataIndex: 'advertise_url',
        key: 'advertise_url',
        render: (text, record) => (record.advertise_type === 'web' ? <a href={text} target="__blank">{text}</a> : ''),
      },
      {
        title: '显示位置',
        dataIndex: 'advertise_location',
        key: 'advertise_location',
      },
      {
        title: '状态',
        dataIndex: 'advertise_status',
        key: 'advertise_status',
        render: text => (text === '1' ? '在线' : '下线'),
      },
      {
        title: '有效期',
        dataIndex: 'advertise_validity_type',
        key: 'advertise_validity_type',
        render: (text, record) => (text === 'fixed' ? <span>{record.advertise_validity_start}<br />{record.advertise_validity_end}</span> : <span>{record.advertise_validity_length}天</span>),
      },
      {
        title: '排序（从大到小显示）',
        dataIndex: 'advertise_sort',
        key: 'advertise_sort',
      },
      {
        title: '操作',
        key: 'operate',
        render: (text, record) => (
          <span>
            <span>
              <a onClick={() => this.handleInfo(record.advertise_id)}>详情</a>
            </span>
          </span>
        ),
      },
    ];
  }

  render() {
    const {
      listResult,
      forceUpdateSelect,
      validityTypeSelect,
    } = this.state;
    // for detail
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 12 },
    };
    const uploadImg = {
      accept: '.jpg,.png,.gif',
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
                      添加运营位
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
              <FormItem {...formItemLayout} label="名称" hasFeedback>
                {getFieldDecorator('advertise_name', {
                  initialValue: this.state.detail.advertise_name || '',
                  rules: [{ required: true, message: '请输入名称' }],
                })(<Input placeholder="请输入名称" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="副标题" hasFeedback>
                {getFieldDecorator('advertise_subtitle', {
                  initialValue: this.state.detail.advertise_subtitle || '',
                })(<Input placeholder="请输入副标题" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="类型" hasFeedback>
                {getFieldDecorator('advertise_type', {
                  initialValue: this.state.detail.advertise_type || '',
                  rules: [{ required: true, message: '请输入类型' }],
                })(<Input placeholder="请输入类型" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="图片" hasFeedback>
                {getFieldDecorator('advertise_image')(<Upload {...uploadImg}>
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>)}
              </FormItem>
              <FormItem {...formItemLayout} label="链接" hasFeedback>
                {getFieldDecorator('advertise_url', {
                  initialValue: `${this.state.detail.advertise_url || ''}`,
                  rules: [{ required: true, message: '请输入链接' }],
                })(<Input placeholder="请输入链接" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="显示位置" hasFeedback>
                {getFieldDecorator('advertise_location', {
                  initialValue: `${this.state.detail.advertise_location || ''}`,
                  rules: [{ required: true, message: '请输入显示位置' }],
                })(<Input placeholder="请输入显示位置" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="排序" hasFeedback>
                {getFieldDecorator('advertise_sort', {
                  initialValue: `${this.state.detail.advertise_sort || ''}`,
                })(<Input placeholder="请输入排序" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="有效期类型" hasFeedback>
                {getFieldDecorator('advertise_validity_type', {
                  initialValue: `${this.state.detail.advertise_validity_type || ''}`,
                  rules: [{ required: true, message: '请选择有效期类型' }],
                })(<Select placeholder="请选择有效期类型" size="large" allowClear >
                  {validityTypeSelect.map(item => <Option value={item.key.toString()} key={item.key.toString()} selected>{item.value}</Option>)}
                </Select>)}
              </FormItem>
              <FormItem {...formItemLayout} label="开始日期（固定）" hasFeedback>
                {getFieldDecorator('advertise_validity_start', {
                  initialValue: `${this.state.detail.advertise_validity_start || ''}`,
                })(<Input placeholder="请输入有效期开始日期" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="结束日期（固定）" hasFeedback>
                {getFieldDecorator('advertise_validity_end', {
                  initialValue: `${this.state.detail.advertise_validity_end || ''}`,
                })(<Input placeholder="请输入有效期结束日期" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="天数（限时）" hasFeedback>
                {getFieldDecorator('advertise_validity_length', {
                  initialValue: `${this.state.detail.advertise_validity_length || ''}`,
                })(<Input placeholder="请输入有效期天数" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="状态" hasFeedback>
                {getFieldDecorator('advertise_status', {
                  initialValue: `${this.state.detail.advertise_status || ''}`,
                  rules: [{ required: true, message: '请选择状态' }],
                })(<Select placeholder="请选择状态" size="large" allowClear >
                  {forceUpdateSelect.map(item => <Option value={item.key.toString()} key={item.key.toString()} selected>{item.value}</Option>)}
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
