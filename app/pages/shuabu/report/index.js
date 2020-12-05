import React, { Component } from 'react';
import {
  Form, Layout,
} from 'antd';
import TableList from '@tableList';
import {
  shuabuReport,
} from '@apis/manage';

const { Content } = Layout;

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
    shuabuReport({ ...this.state.searchKey, id: this.props.params.id }, (res) => {
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
        title: '日期',
        dataIndex: 'report_date',
        key: 'report_date',
      },
      {
        title: '新用户数',
        dataIndex: 'new_user',
        key: 'new_user',
      },
      {
        title: '发放金币数',
        dataIndex: 'new_gold',
        key: 'new_gold',
      },
      {
        title: '登陆用户数',
        dataIndex: 'login_user',
        key: 'login_user',
      },
      {
        title: '提现金额',
        dataIndex: 'withdraw_value',
        key: 'withdraw_value',
      },
      {
        title: '提现用户数',
        dataIndex: 'withdraw_count',
        key: 'withdraw_count',
      },
      {
        title: '分享用户数',
        dataIndex: 'share_count',
        key: 'share_count',
      },
    ];
  }

  // #endregion

  render() {
    const {
      listResult,
    } = this.state;

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
