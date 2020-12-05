import React, { Component } from 'react';
import {
  Button, Form, Layout, Input, message, Select, Upload, Icon, Popconfirm,
} from 'antd';
import TableList from '@tableList';
import {
  shuabuGold,
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
  }

  // 组件即将加载
  componentWillMount() {
    this.setState(() => {
      this.getData();
    });
  }

  // 获取活动列表数据
  getData(callback) {
    shuabuGold({ ...this.state.searchKey, id: this.props.params.id }, (res) => {
      this.setState({
        listResult: res.data,
      });
      callback && callback();
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
        title: '金币金额',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '金币来源',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '明细时间',
        dataIndex: 'create_time',
        key: 'create_time',
      },
    ];
  }

  // #endregion

  render() {
    const {
      listResult,
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
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
