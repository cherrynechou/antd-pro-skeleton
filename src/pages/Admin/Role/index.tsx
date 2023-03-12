import {
  useRef,
} from "react";
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable
} from '@ant-design/pro-components';
import {
  Button,
  Popconfirm,
  Space,
  Tag
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { queryRoles } from "@/services/admin/auth/role";
import _ from "lodash";
import CreateOrEdit from './components/CreateOrEdit'

export type TableListItem = {
  id: number;
  name: string;
  slug: string,
  created_at: number;
  update_at: number;
};


export default () =>{

  const actionRef = useRef<ActionType>();

  //自定查询
  const requestData = async (params: any) =>{
    const filter = _.omit(params,['current','pageSize']);
    const rename = {
      page: params.current,
      pageSize: params.pageSize
    }
    const mergeParams = Object.assign({} , filter , rename);
    const ret = await queryRoles(mergeParams);

    return {
      data: ret.data.data,
      total: ret.data.meta.pagination.total,
      success: ret.status === 200
    }
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      width: 40,
      dataIndex: 'id',
      align: 'center',
      sorter: (a, b) => a.id - b.id,
      hideInSearch: true,
    }, {
      title: '标识',
      width: 80,
      align: 'center',
      dataIndex: 'slug',
      render: (_, record) => (
        <Space>
          <Tag color='#586cb1'>
            {record.slug}
          </Tag>
        </Space>
      )
    }, {
      title: '名称',
      width: 80,
      align: 'center',
      dataIndex: 'name'
    },{
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
      width: 40,
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (_,record) => [
        <a key="link">编辑</a>,
        <Popconfirm key="del" placement="top" title='确认操作?' okText="Yes" cancelText="No">
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer title="角色列表">
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={requestData}
        rowKey="id"
        dateFormatter="string"
        headerTitle="角色列表"
        rowSelection={{ fixed: true }}
        pagination={{
          pageSize: 20,
          onChange: (page) => console.log(page),
        }}
        toolBarRender={() => [
          <Button type="primary" icon={<PlusOutlined />} key="primary">
            新增
          </Button>,
        ]}
      >
      </ProTable>
    </PageContainer>
  )
}
