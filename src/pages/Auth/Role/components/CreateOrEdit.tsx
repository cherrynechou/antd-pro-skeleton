import {
  useEffect,
  useState
} from "react";
import type { TreeProps } from 'antd/es/tree';
import {
  Modal,
  Form,
  Input,
  Tree,
  message,
  Skeleton
} from 'antd';
import {
  queryAllPermissions
} from '@/services/admin/auth/permission';
import {
  createRole,
  getRole,
  updateRole
} from '@/services/admin/auth/role';
import {
  filterTreeLeafNode,
  listToTree
} from "@/utils/utils";

export default (props: any) =>{
  const [ initialValues, setInitialValues ] = useState<any>({});
  const [ treeData, setTreeData] = useState<any>([]);
  const [ treeLeafRecord, setTreeLeafRecord ] = useState<any>([]);
  const [ defaultCheckedKeys, setDefaultCheckedKeys ] = useState<any>([]);
  const { isModalVisible, isShowModal, editId, actionRef } = props;

  const [ form ] = Form.useForm();

  const fetchApi = async () =>{

    const permissionAllRes = await queryAllPermissions();
    if(permissionAllRes.status === 200){
      const _permissionData = permissionAllRes.data;
      const listTreePermissionData = listToTree(_permissionData)
      setTreeData(listTreePermissionData);
      setTreeLeafRecord(filterTreeLeafNode(listTreePermissionData))
    }

    if(editId !== undefined){
      const roleRes = await getRole(editId);
      if(roleRes.status === 200){
        const currentData = roleRes.data;
        let permissionList: any[] = [];
        if(currentData.permissions.length>0){
          permissionList = currentData.permissions.map((item: any)=>{return item.id})
        }

        setDefaultCheckedKeys(permissionList);

        setInitialValues({
          name: currentData.name,
          slug: currentData.slug,
          permissions:JSON.stringify(permissionList)
        })
      }
    }
  }

  const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
    //找出叶子节点
    const filterChildNodes = treeLeafRecord.map((item: any) => {return item.id})
    const filterSameKeys = filterChildNodes.filter((item: any)=> (selectedKeys.indexOf(item) > -1))
    form.setFieldsValue({permissions:JSON.stringify( filterSameKeys) });
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys) => {
    // @ts-ignore
    const checkedKeysResult = [...checkedKeys]
    //找出叶子节点
    const filterChildNodes = treeLeafRecord.map((item: any) => {return item.id})
    const filterSameKeys = filterChildNodes.filter((item: any)=> (checkedKeysResult?.indexOf(item) > -1))
    form.setFieldsValue({permissions:JSON.stringify( filterSameKeys) });
  };

  const title = editId === undefined ? '添加' : '编辑';

  useEffect(() => {
    fetchApi();
  },[])

  const handleOk = async () =>{
    const fieldsValue = await form.validateFields();

    let response = {};
    if(editId === undefined){
      response = await createRole(fieldsValue);
    }else{
      response = await updateRole(editId,fieldsValue);
    }

    if(response.status === 200){
      isShowModal(false);
      message.success(`${title}成功`);
      actionRef.current.reload();
    }
  }

  return (
    <Modal 
       title={title}
       bodyStyle={{'height':'calc(100vh - 400px)','overflowY':'auto'}}
       open={isModalVisible}
       onOk={handleOk}
       onCancel={()=>isShowModal(false)}
       destroyOnClose={true}
       width={750}
    >
      {
        Object.keys(initialValues).length === 0 && editId !== undefined ? <Skeleton paragraph={{ rows: 4 }} /> :
          <Form
            name="role-update"
            form={form}
            initialValues={initialValues}
            autoComplete="off"
          >
            <Form.Item
              name="name"
              label="名称"
              labelCol={{ span: 3 }}
              rules={[{ required: true, message: '名称是必填项！' }]}
            >
              <Input
                placeholder="请输入 名称" />
            </Form.Item>

            <Form.Item
              name="slug"
              label="标识"
              abelCol={{ span: 3 }}
              rules={[{ required: true, message: '标识是必填项！' }]}
            >
              <Input
                placeholder="请输入 名称" />
            </Form.Item>

            <Form.Item
              name="permissions"
              hidden
            >
              <Input hidden
                     placeholder="请输入 名称" />
            </Form.Item>

            <Form.Item
              label="权限"
              labelCol={{ span: 3 }}
            >
              <Tree
                checkable
                defaultExpandAll={false}
                defaultCheckedKeys={defaultCheckedKeys}
                onSelect={onSelect}
                onCheck={onCheck}
                treeData={treeData}
              />
            </Form.Item>
          </Form>
      }
    </Modal>
  )
}
