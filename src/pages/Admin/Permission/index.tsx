import  {
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
  message,
  Popconfirm,
  Space,
  Tag
} from "antd";
import { v4 as uuid } from 'uuid';
import { PlusOutlined } from "@ant-design/icons";
import {
  queryPermissions
} from "@/services/admin/auth/permission";
export type TableListItem = {
  id: number;
  name: string;
  slug: string;
  methods: any[];
  paths: any[];
  order: number;
  parent_id: number;
  created_at: number;
  update_at: number;
};


export default () =>{

  const [ permissionTreeData, setPermissionTreeData ] = useState<any>([]);

  const actionRef = useRef<ActionType>();


  //自定查询
  const requestData = async () =>{
    const permissionRes = await queryPermissions();
    setPermissionTreeData(permissionRes.data);
    return {
      data: permissionRes.data,
      success: permissionRes.status === 200
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
    },{
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
      dataIndex: 'name',
    },{
      title: '授权信息',
      width: 80,
      align: 'center',
      render: (_,record)=>(
        <Space>
          {record.methods.map( (method: string) => (
            <Tag key={uuid()} color='#586cb1'>
              {method}
            </Tag>
          ))}
          {record.paths.map( (path: string) => (
            <Tag color='#f7f7f9' key={uuid()} style={{ color:'#586cb1'}}>
              {path}
            </Tag>
          ))}
        </Space>
      )
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
        <Popconfirm key="del" placement="top" title='确认操作?' okText="Yes" cancelText="No">
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer title="权限管理">
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={requestData}
        search={false}
        rowKey="id"
        dateFormatter="string"
        headerTitle="权限列表"
        rowSelection={{ fixed: true }}
        pagination={false}
        toolBarRender={() => [
          <Button type="primary" icon={<PlusOutlined />}>
            新增
          </Button>,
        ]}
      >
      </ProTable>
    </PageContainer>
  )
}
