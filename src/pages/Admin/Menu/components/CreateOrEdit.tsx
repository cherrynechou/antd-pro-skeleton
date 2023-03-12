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
  Upload,
  message
} from "antd";
import { treeToOrderList } from '@/utils/utils';
import _ from 'lodash';



export default (props: any) =>{

  const [ form ] = Form.useForm();

  const [ treeData, setTreeData] = useState<any>([]);
  const [ initialValues, setInitialValues ] = useState<any>({});
  const [ linkTarget, setLinkTarget] = useState<any>([]);
  const [ roles, setRoles ] = useState<any>([]);
  const [ routes, setRoutes ] = useState<any>([]);
  const { isModalOpen, handleCancel, editId, menuData } = props;

  const title = editId === undefined ? '添加菜单' : '修改菜单';

  const fetchApi = async () =>{
    //生成树型结构
    setTreeData(treeToOrderList(menuData));

    const targets=[
      {label:'新窗口', value:'_blank'},
      {label:'当前窗口', value:'',}
    ];
  }

  useEffect( () =>{
    fetchApi();
  },[]);


  const handleOk = () =>{

  }



  return (
    <Modal title={title}
       open={isModalOpen}
       onOk={handleOk}
       onCancel={handleCancel}
       destroyOnClose
       width={750}
    >



    </Modal>
  )
}
