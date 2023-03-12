import {
  useRef,
  useState
} from "react";
import type {
  ActionType,
  ProColumns
} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable
} from '@ant-design/pro-components';
import {
  Button,
  Space,
  Tag,
  Switch,
  Popconfirm
} from 'antd';
import {
  queryUsers,
} from '@/services/admin/auth/user';
import _ from 'lodash';
import { PlusOutlined } from '@ant-design/icons';

export type TableListItem = {
  id: number;
  username: string;
  name: string;
  email: string,
  roles: {
    data: []
  },
  is_administrator: boolean;
  phone: string,
  status: number,
  login_count: number,
  created_at: number;
  update_at: number;
};

export type RoleItem = {
  name: string;
}


export default () =>{

  const actionRef = useRef<ActionType>();

  //获取用户用户列表
  const requestData = async (params: any) =>{
    const filter = _.omit(params,['current','pageSize']);

    const rename = {
      page:params.current,
      pageSize:params.pageSize
    }
    const mergeParams = Object.assign({},filter,rename);
    console.log(mergeParams);

    const ret = await queryUsers(mergeParams);

    return {
      data: ret.data.data,
      total: ret.data.meta.pagination.total,
      success: ret.status === 200
    }
  }

  //列表
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      width: 40,
      dataIndex: 'id',
      align: 'center',
      sorter: (a, b) => a.id - b.id,
      hideInSearch: true,
    }, {
      title: '用户名',
      width: 80,
      align: 'center',
      dataIndex: 'username',
    }, {
      title: '名称',
      width: 80,
      align: 'center',
      dataIndex: 'name',
      hideInSearch: true,
    },{
      title: '角色',
      width: 80,
      align: 'center',
      dataIndex: 'roles',
      hideInSearch: true,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record) => (
        <Space>
          {record.roles.data.map( (item: RoleItem,index: number) => (
            <Tag key={index} color='#586cb1'>
              {item.name}
            </Tag>
          ))}
        </Space>
      ),
    }, {
      title: '手机号',
      width: 80,
      align: 'center',
      dataIndex: 'phone'
    }, {
      title: '邮箱',
      width: 80,
      align: 'center',
      dataIndex: 'email',
      hideInSearch: true,
    }, {
      title: '是否禁用',
      width: 80,
      align: 'center',
      dataIndex: 'is_black',
      hideInSearch: true,
      render:(_,record)=>(
        <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked = { record.status === 1 } disabled = { record.is_administrator }/>
      )
    }, {
      title: '登录次数',
      width: 80,
      align: 'center',
      dataIndex: 'login_count',
      hideInSearch: true,
    }, {
      title: '创建时间',
      width: 120,
      align: 'center',
      dataIndex: 'created_at',
      hideInSearch: true,
    }, {
      title: '更新时间',
      width: 120,
      align: 'center',
      dataIndex: 'updated_at',
      hideInSearch: true,
    }, {
      title: '操作',
      width: 180,
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (_,record) => [
        <a key="link" >编辑</a>,
        <Popconfirm key="del" placement="top" title='确认操作?'  okText="Yes" cancelText="No">
          <a>删除</a>
        </Popconfirm>,
        <Popconfirm key="reset" placement="top" title='确认操作?' okText="Yes" cancelText="No">
          <a>重置密码</a>
        </Popconfirm>
      ],
    },
  ];

  return (
    <PageContainer title="用户管理">
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={requestData}
        rowKey="id"
        dateFormatter="string"
        headerTitle="用户列表"
        rowSelection={{ fixed: true }}
        pagination={{
          pageSize: 20,
          onChange: (page) => console.log(page),
        }}
        toolBarRender={() => [
          <Button type="primary" icon={<PlusOutlined />}  >
            新增
          </Button>,
        ]}
      >
      </ProTable>
    </PageContainer>
  )
}
