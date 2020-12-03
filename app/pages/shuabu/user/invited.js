import React, { Component } from 'react';
import {
  Form, Layout,
} from 'antd';
import TableList from '@tableList';
import {
  zouInvited,
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
    zouInvited({ ...this.state.searchKey, id: this.props.params.id }, (res) => {
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
        title: '用户Id',
        dataIndex: 'user_id',
        key: 'user_id',
      },
      {
        title: '用户昵称',
        dataIndex: 'u_name',
        key: 'u_name',
      },
      {
        title: '被邀请用户Id',
        dataIndex: 'invited_id',
        key: 'invited_id',
      },
      {
        title: '被邀请用户昵称',
        dataIndex: 'i_name',
        key: 'i_name',
      },
      {
        title: '邀请时间',
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
