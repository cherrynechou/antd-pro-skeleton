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
  Popconfirm,
  Switch
} from "antd";
import {
  queryMenus
} from '@/services/admin/auth/menu';
import Icon, { PlusOutlined } from "@ant-design/icons";
import * as icons from '@ant-design/icons';

export type TableListItem = {
  id: number;
  name: string;
  path: string;
  parent_id: number;
  target: string;
  url: string;
  icon: string;
  order: number;
  status: number;
  type: number;
  created_at: number;
  update_at: number;
};


export default () =>{

  const [ menuData, setMenuData ] = useState([]);

  const actionRef = useRef<ActionType>();

  //自定查询
  const requestData = async () =>{
    const ret = await queryMenus();
    setMenuData(ret.data);
    return {
      data: ret.data,
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
      title: '图标',
      width: 20,
      align: 'center',
      dataIndex: 'icon',
      render:(_,record)=>(
        record.icon && <Icon component={icons[record.icon]} style={{ fontSize: '16px' }} />
      )
    }, {
      title: '名称',
      width: 80,
      align: 'center',
      dataIndex: 'name',
    }, {
      title: '路由',
      width: 80,
      align: 'center',
      dataIndex: 'path',
    }, {
      title: '排序',
      width: 80,
      align: 'center',
      dataIndex: 'order',
    },{
      title: '显示',
      width: 80,
      align: 'center',
      dataIndex: 'status',
      hideInSearch: true,
      render:(_,record)=>(
        <Switch checkedChildren="开启" unCheckedChildren="关闭"  defaultChecked= { record.status === 1 }/>
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
        <Popconfirm key="del" placement="top" title='确认操作?' onConfirm={ () => confirmDel(record.id) } okText="Yes" cancelText="No">
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <PageContainer title="菜单管理">
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={requestData}
        search={false}
        rowKey="id"
        dateFormatter="string"
        headerTitle="菜单列表"
        rowSelection={{ fixed: true }}
        pagination={false}
        toolBarRender={() => [
          <Button type="primary">
            新增
          </Button>,
        ]}
      >
      </ProTable>

    </PageContainer>
  )
}
