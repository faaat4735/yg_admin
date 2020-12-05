import React, { Component } from 'react';
import {
  Button,
  Form,
  Layout,
} from 'antd';
import TableList from '@tableList';
import {
  shuabuActivity,
  shuabuActivityDetail,
} from '@apis/manage';
import Detail from './modal/detail';

const { Content } = Layout;

@Form.create({})
// 声明组件  并对外输出
export default class app extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props) {
    super(props);
    this.state = {
      // activeTab: 'list',
      searchtitle: '',
      showDetail: false,
      synchronizeLoading: false,
      RoleVisible: false,
      spinloading: true,
      moduletitle: '',
      moduletype: '',
      currPeopleId: '',
      // hasList: false,
      searchKey: {
        pageSize: 10,
        pageNo: 1,
      },
      userDeptResult: { list: [], loading: false },
      listResult: { list: [], loading: false },
      detailResult: {},
      //      userRoleSetResult: { list: [], loading: false },
    };
  }

  // 组件即将加载
  componentWillMount = () => {
    this.setState(() => {
      this.getData();
    });
  };

  // 组件已经加载到dom中
  componentDidMount = () => {
    this.props.form.setFieldsValue({ key: '' });
  };

  // 获取活动列表数据
  getData(callback) {
    shuabuActivity({ ...this.state.searchKey }, (res) => {
      this.setState({
        listResult: res.data,
      });
      callback && callback();
    });
  }

  // 点击详情
  handleInfo = (id) => {
    shuabuActivityDetail({ activity_id: id }, (res) => {
      this.setState({
        detailResult: res.data,
        showDetail: true,
        moduletype: 'edit',
        moduletitle: '详情',
        currPeopleId: id,
      });
    });
  };

  // 新增或编辑用户保存
  handleOk = () => {
    const curUserListResult = this.state.listResult;
    const curPageSize = this.state.searchKey.pageSize;
    let curpage = this.state.searchKey.pageNo;
    if (
      this.state.moduletype === 'add' &&
      curUserListResult &&
      curUserListResult.totalCount > 0
    ) {
      curpage = Math.floor(curUserListResult.totalCount / curPageSize) + 1;
    }
    this.setState(
      {
        showDetail: false,
        searchKey: {
          ...this.state.searchKey,
          pageNo: curpage,
        },
      },
      () => {
        this.getData();
      },
    );
  };

  // 点击新增人员的时候判断部门 deptid  是否存在，有则弹窗新增
    add = () => {
      this.setState({
        showDetail: true,
        moduletype: 'add',
        moduletitle: '新增',
      });
    }

  // 新增用户modal取消
  handleCancel = () => {
    this.setState({ showDetail: false });
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
        title: '活动类型',
        dataIndex: 'activity_type',
        key: 'activity_type',
        width: '15%',
      },
      {
        title: '活动名称',
        dataIndex: 'activity_name',
        key: 'activity_name',
        width: '15%',
      },
      {
        title: '活动描述',
        dataIndex: 'activity_desc',
        key: 'activity_desc',
        width: '15%',
      },
      {
        title: '活动奖励最小值',
        dataIndex: 'activity_award_min',
        key: 'activity_award_min',
        width: '15%',
        render: (text, record) => (['sign', 'walk', 'walk_stage'].indexOf(record.activity_type) !== -1 ? '-' : text),
      },
      {
        title: '活动奖励最大值',
        dataIndex: 'activity_award_max',
        key: 'activity_award_max',
        width: '15%',
        render: (text, record) => (['sign', 'walk', 'walk_stage'].indexOf(record.activity_type) !== -1 ? '-' : text),
      },
      {
        title: '活动最大次数（每日）',
        dataIndex: 'activity_max',
        key: 'activity_max',
        width: '15%',
        render: (text, record) => (['sign', 'walk', 'walk_stage'].indexOf(record.activity_type) !== -1 ? '-' : text),
      },
      {
        title: '活动间隔时间（分钟）',
        dataIndex: 'activity_duration',
        key: 'activity_duration',
        width: '15%',
        render: (text, record) => (['sign', 'walk', 'walk_stage'].indexOf(record.activity_type) !== -1 ? '-' : text),
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        width: '15%',
      },
      {
        title: '操作',
        key: 'operate',
        width: '15%',
        render: (text, record, index) => (
          <span>
            <span>
              <a onClick={() => this.handleInfo(record.activity_id)}>详情</a>
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
      detailResult,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const thevalue = this.state.moduletype === 'add' ? '' : detailResult;

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
                  loading={listResult.loading}
                  scroll={{ y: true }}
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
                      添加活动
                  </Button>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
        {/* 允许新增的判断 */}
        {this.state.showDetail ? (
          <Detail
            visible={this.state.showDetail}
            title={this.state.moduletitle}
            handleOk={this.handleOk}
            values={thevalue}
            deptId={this.state.searchKey.deptCode}
            currPeopleId={this.state.currPeopleId}
            type={this.state.moduletype}
            onCancel={this.handleCancel}
          />
        //            roleList={userRoleSetResult.list || []}
        ) : null}
      </div>
    );
  }
}
