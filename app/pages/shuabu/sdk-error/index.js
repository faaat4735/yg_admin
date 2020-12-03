import React, { Component } from 'react';
import {
  Form, Layout,
} from 'antd';
import TableList from '@tableList';
import {
  zousdkError,
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
    zousdkError({ ...this.state.searchKey, id: this.props.params.id }, (res) => {
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
        title: '错误来源',
        dataIndex: 'sdk_source',
        key: 'sdk_source',
      },
      {
        title: '版本号',
        dataIndex: 'version_id',
        key: 'version_id',
      },
      {
        title: '错误代码',
        dataIndex: 'error_code',
        key: 'error_code',
      },
      {
        title: '代码位',
        dataIndex: 'adpos_id',
        key: 'adpos_id',
      },
      {
        title: '用户Id',
        dataIndex: 'user_id',
        key: 'user_id',
      },
      {
        title: '手机品牌',
        dataIndex: 'brand',
        key: 'brand',
      },
      {
        title: '手机型号',
        dataIndex: 'model',
        key: 'model',
      },
      {
        title: '发生时间',
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
