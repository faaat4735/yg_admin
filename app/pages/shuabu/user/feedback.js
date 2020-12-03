import React, { Component } from 'react';
import {
  Form, Layout,
} from 'antd';
import TableList from '@tableList';
import {
  zouFeedback,
} from '@apis/manage';
import { zouOss } from '@config';

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
    zouFeedback({ ...this.state.searchKey, id: this.props.params.id }, (res) => {
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
        title: '手机号',
        dataIndex: 'phone_number',
        key: 'phone_number',
      },
      {
        title: '反馈内容',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '反馈手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '反馈图片1',
        dataIndex: 'image_1',
        key: 'image_1',
        render: text => (text ? <img className="auto_img" src={`${zouOss}/${text}`} /> : ''),
      },
      {
        title: '反馈图片2',
        dataIndex: 'image_2',
        key: 'image_2',
        render: text => (text ? <img className="auto_img" src={`${zouOss}/${text}`} /> : ''),
      },
      {
        title: '反馈图片3',
        dataIndex: 'image_3',
        key: 'image_3',
        render: text => (text ? <img className="auto_img" src={`${zouOss}/${text}`} /> : ''),
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
