
import React, { Component } from 'react'
import { Button, Form, Input, message, Select } from 'antd'
import { browserHistory } from 'react-router'
import Drawer from '@components/draw/draw'
import {
  shuabuActivityDetailUpdate,
} from '@apis/manage'

const FormItem = Form.Item
const { Option } = Select

@Form.create({})

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // 组件已经加载到dom中
  componentDidMount() {
    this.props.form.resetFields()
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      this.setState({ loading: true }, () => {
        shuabuActivityDetailUpdate({ ...values, id: this.props.currPeopleId, action: this.props.type }, (res) => {
          message.success('Operation success')
          this.state.loading = false
          this.props.handleOk()
        }, (errorRes) => {
          message.warning(errorRes.msg)
          this.setState({ loading: false })
        });
      })
    })
  }

  footer() {
    return (
      <div>
        <Button type="primary" onClick={this.handleSubmit} loading={this.state.loading}>确定</Button>
        <Button onClick={this.props.onCancel}>取消</Button>
      </div>
    )
  }

  render() {
    const {
      visible, onCancel, title, roleList, values,
    } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 12 },
    };
    const isSpecial = (['sign', 'walk', 'walk_stage'].indexOf(values.activity_type) !== -1);
    (values.roleIds || []).map((item, index) => (values.roleIds.splice(index, 1, String(item))));
    return (
      <Drawer
        visible={visible}
        title={title}
        onCancel={onCancel}
        footer={this.footer()}
        className="modal-header modal-body"
      >
        <div className="modalcontent">
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="活动类型" hasFeedback>
              {getFieldDecorator('activity_type', {
                initialValue: values.activity_type || '',
                rules: [{ required: true, message: '请输入活动类型' }],
              })(<Input placeholder="请输入活动类型" disabled={values.activity_type == 'sign'} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="活动名称" hasFeedback>
              {getFieldDecorator('activity_name', {
                initialValue: values.activity_name || '',
                rules: [{ required: true, message: '请输入活动名称' }],
              })(<Input placeholder="请输入活动名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="活动描述" hasFeedback>
              {getFieldDecorator('activity_desc', {
                initialValue: values.activity_desc || '',
              })(<Input placeholder="请输入活动描述" />)}
            </FormItem>
            { isSpecial ?
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
                onClick={() => browserHistory.push(`/shuabu-config/${values.activity_type}`)}
              >
                {' '}
                      规则详情
              </Button> :
              (<div>
                <FormItem {...formItemLayout} label="活动奖励最小值" hasFeedback>
                  {getFieldDecorator('activity_award_min', {
                    initialValue: values.activity_award_min || '',
                    rules: [
                      { required: true, message: '请输入活动奖励最小值' },
                      { pattern: /^\d+$/, message: '请输入整数' },
                    ],
                  })(<Input placeholder="请输入活动奖励最小值" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="活动奖励最大值" hasFeedback>
                  {getFieldDecorator('activity_award_max', {
                    initialValue: values.activity_award_max || '',
                    rules: [
                      { required: true, message: '请输入活动奖励最大值' },
                      { pattern: /^\d+$/, message: '请输入整数' },
                    ],
                  })(<Input placeholder="请输入活动奖励最大值" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="活动最大次数（每日）" hasFeedback>
                  {getFieldDecorator('activity_max', {
                    initialValue: values.activity_max || '',
                    rules: [
                      { required: true, message: '请输入活动最大次数' },
                      { pattern: /^\d+$/, message: '请输入整数' },
                    ],
                  })(<Input placeholder="请输入活动最大次数" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="活动间隔时间（分钟）" hasFeedback>
                  {getFieldDecorator('activity_duration', {
                    initialValue: values.activity_duration || '',
                    rules: [
                      { required: true, message: '请输入活动间隔时间' },
                      { pattern: /^\d+$/, message: '请输入整数' },
                    ],
                  })(<Input placeholder="请输入活动间隔时间" />)}
                </FormItem></div>)
            }
          </Form>
        </div>
      </Drawer>
    )
  }
}
