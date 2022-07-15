import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Form, Input } from '@dx/xbee'

@inject('actions')
@observer
export default class ItemForm extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { form, data } = this.props

    return (
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 19 }}
        initialValues={data}
      >
        {data && data.id ? (
          <Form.Item label="ID" style={{ display: 'none' }} name="id">
            <Input type="hidden" />
          </Form.Item>
        ) : null}

        <Form.Item
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入名称',
            },
          ]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
      </Form>
    )
  }
}
