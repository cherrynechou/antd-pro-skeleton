import {
  useEffect,
  useState
} from "react"
import {
  Skeleton,
  Form,
  Input,
  Modal,
  Select,
  message,
  Switch,
  InputNumber
} from "antd";
import {
  SelectIcon
} from '@/components/Forms'
import {
  treeToOrderList,
  queryListMaxValue
} from '@/utils/utils';
import {
  createMenu,
  getMenu,
  updateMenu
} from '@/services/admin/auth/menu'
import {queryAllRoles} from "@/services/admin/auth/role";
import { routeList } from "./routeListData";
import _ from 'lodash';
import '@/styles/auth.less'


export default (props: any) =>{
  const [ treeData, setTreeData] = useState<any>([]);
  const [ initialValues, setInitialValues ] = useState<any>({});
  const [ linkTarget, setLinkTarget] = useState<any>([]);
  const [ roles, setRoles ] = useState<any>([]);
  const [ routes, setRoutes ] = useState<any>([]);
  const { isModalVisible, isShowModal, editId, menuData } = props;

  const [ form ] = Form.useForm();

  const title = editId === undefined ? '添加' : '编辑';

  const fetchApi = async () =>{
    //生成树型结构
    const treeValues = treeToOrderList(menuData);
    setTreeData(treeValues);

    const targets=[
      {label:'新窗口', value:'_blank'},
      {label:'当前窗口', value:'',}
    ];

    setLinkTarget(targets);

    //生成路由列表
    if(routeList.length>0){
      const _routeList: any[] = [];
      routeList.forEach((item: string)=>{
        _routeList.push({
          label:item,
          value:item
        });
      })
      setRoutes(_routeList);
    }

    //角色列表
    //获取角色列表
    const rolesRes = await queryAllRoles();
    if(rolesRes.status === 200){
      const rolesData = rolesRes.data;
      const rolesValue: any[] = [];
      rolesData.forEach((item: any)=>{
        rolesValue.push({value:item.id,label:item.name});
      })
      setRoles(rolesValue);
    }

    if(editId !== undefined){
      const menuRes = await getMenu(editId);
      if(menuRes.status === 200){
        const menu = menuRes.data;
        let rolesValue: any[] = [];
        if(menu.roles.length>0){
          rolesValue = menu.roles.map((item: any) => {return item.id})
        }

        setInitialValues({
          name: menu.name,
          parent_id: menu.parent_id,
          icon: menu.icon,
          path: menu.path,
          target: menu.target,
          order: menu.order,
          roles:rolesValue,
          status: menu.status
        });
      }
    }else{
      const sort_max = queryListMaxValue(treeValues,'order');
      form.setFieldsValue({
        order: sort_max + 1,
        status: true
      })
    }
  }

  useEffect( () =>{
    fetchApi();
  },[]);

  /**
   * 提交
   */
  const handleOk = async () =>{
    const fieldsValue = await form.validateFields();

    const omit_values = _.omit(fieldsValue,['status']);
    const pick_values = _.pick(fieldsValue,['status']);

    const new_values = {
      ...omit_values,
      status: !!pick_values.status ? 1 : 0
    };

    let response ={};
    if(editId === undefined){
      response = await createMenu(fieldsValue);
    }else{
      response = await updateMenu(editId,new_values);
    }

    if(response.status === 200){
      isShowModal(false);
      message.success('修改成功');
      setTimeout(()=>{
        window.location.reload();
      },100)
    }
  }


  const handleIconChange = (icon: string) =>{
    setInitialValues({
      ...initialValues,
      icon:icon
    })
  }

  return (
    <Modal title={title}
       open={isModalVisible}
       onOk={handleOk}
       onCancel={() => isShowModal(false)}
       destroyOnClose
       width={750}
    >
      {
        Object.keys(initialValues).length === 0 && editId !== undefined ? <Skeleton paragraph={{ rows: 4 }} /> :
          <Form
            form={form}
            initialValues={initialValues}
            autoComplete="off"
          >
            <Form.Item
              name="parent_id"
              label="父级"
              rules={[{ required: true, message: '父级是必填项！' }]}
            >
              <Select
                options={treeData}
                style={{ width: 200 }}
                placeholder="请选择父级" />
            </Form.Item>

            <Form.Item
              name="icon"
              label="图标"
            >
              <SelectIcon placeholder="请选择 图标" onChange={handleIconChange} />
            </Form.Item>

            <Form.Item
              name="name"
              label="名称"
              rules={[{ required: true, message: '名称是必填项！' }]}
            >
              <Input
                placeholder="请输入 名称" />
            </Form.Item>

            <Form.Item
              name="path"
              label="路由"
            >
              <Select
                options={routes}
                style={{ width: 200 }}
                placeholder="请选择 路由"
              />
            </Form.Item>

            <Form.Item
              name="url"
              label="跳转地址"
            >
              <Input
                placeholder="请输入 地址" />
            </Form.Item>

            <Form.Item
              name="target"
              label="目标方式"
            >
              <Select
                options={linkTarget}
                style={{ width: 200 }}
                placeholder="请选择目标方式"
              />
            </Form.Item>

            <Form.Item
              name="order"
              label="排序"
            >
              <InputNumber
                style={{ width: 400 }}
                placeholder="请输入 排序" />
            </Form.Item>

            <Form.Item
              name="status"
              label="是否显示"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭" />
            </Form.Item>

            <Form.Item
              name="roles"
              label="角色"
            >
              <Select
                mode="multiple"
                options={roles}
                style={{ width: 200 }}
                placeholder="请选择角色"
              />
            </Form.Item>
          </Form>
      }
    </Modal>
  )
}
