import {
  useEffect,
  useState
} from "react";
import {
  queryAllRoles
} from '@/services/admin/auth/role';
import {
  getUser,
  createUser,
  updateUser
} from '@/services/admin/auth/user';
import { PlusOutlined } from '@ant-design/icons';
import {
  Modal,
  Skeleton,
  Form,
  Input,
  Upload,
  Select,
  message
} from "antd";
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile, UploadProps } from 'antd/es/upload';
import {
  uploadFile
} from '@/services/admin/system/common';
import _ from "lodash";
import '@/styles/auth.less'

export default (props: any) =>{
  const [ initialValues, setInitialValues ] = useState<any>({});
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [ roles, setRoles] = useState<any>([]);
  const { isModalVisible, isShowModal, editId, actionRef } = props;

  const [ form ] = Form.useForm();

  const title = editId === undefined ? '添加' : '编辑';

  const fetchApi = async () =>{

    const roleRes = await queryAllRoles();

    if(roleRes.status === 200){
      const roleData = roleRes.data;

      const roleList: any[] = [];
      roleData.forEach((item: any)=>{
        roleList.push({label:item.name,value:item.id});
      })

      setRoles(roleList);
    }

    if(editId !== undefined){
      const userRes = await getUser(editId);
      if(userRes.status === 200){
        const userData = userRes.data;

        const roleList: any[] = [];
        userData.roles.forEach((item: any)=>{
          roleList.push(item.id);
        })

        setFileList([
          {
            uid: userData.id,
            name: '',
            status: 'done',
            url: userData.avatar,
          }
        ]);

        setInitialValues({
          username: userData.username,
          name: userData.name,
          avatar:userData.avatar,
          roles:roleList
        });
      }
    }
  }

  useEffect(() => {
    fetchApi();
  },[])

  const handleOk = async () =>{
    const fieldsValue = await form.validateFields();

    //去掉 confirm
    const fieldsPostValue = _.pick(fieldsValue,['name','username','avatar','roles','password']);

    let response = {};
    if(editId === undefined){
      response = await createUser(fieldsPostValue);
    }else{
      response = await updateUser(editId, fieldsPostValue);
    }

    if(response.status === 200){
      isShowModal(false);
      message.success('更新成功');
      actionRef.current.reload();
    }
  }

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>添加文件</div>
    </div>
  );

  const handleUpload = async ( options: any ) =>{
    const { file } = options;
    options.onProgress({percent:50});
    setFileList([file]);
    const name = file.name;
    const fileName =name.substring(0,name.indexOf('.'));
    getBase64(file).then((r: any)=>{
      const index = r.indexOf('base64');
      const fileValue = r.substring(index + 7);

      const formData = {
        upload_name: fileName,
        upload_data: fileValue
      }

      uploadFile(formData).then((response: any)=>{
        if(response.status === 200){
          message.success('上传成功');
        }
      });

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
              name="username"
              label="用户名"
              rules={[{ required: true, message: '用户名是必填项！' }]}
            >
              <Input
                placeholder="请输入 用户名" />
            </Form.Item>

            <Form.Item
              name="name"
              label="名 称"
              rules={[{ required: true, message: '名称是必填项！' }]}
            >
              <Input
                placeholder="请输入 名称" />
            </Form.Item>

            <Form.Item
              name="avatar"
              hidden
            >
              <Input hidden />
            </Form.Item>

            <Form.Item
              label="头像"
            >
              <Upload
                accept='image/*'
                listType="picture-card"
                fileList={ fileList }
                customRequest={ handleUpload }
                onChange={ handleChange }
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Form.Item>

            {/*添加*/}
            {editId === undefined &&
              <>
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[
                    {
                      required: true,
                      message: '密码不能为空！',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (value.length>=6) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('密码长度至少6位!'));
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="confirm"
                  label="确认密码"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: '请确认你的密码！',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('输入的密码不匹配!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </>
            }

            {/*编辑*/}
            {editId !== undefined &&
              <>
                <Form.Item
                  name="password"
                  label="密码"
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="confirm"
                  label="确认密码"
                  dependencies={['password']}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>
              </>
            }

            <Form.Item
              name="roles"
              label="角色"
              rules={[{ required: true, message: '名称是必填项！' }]}
            >
              <Select
                mode="multiple"
                options={roles}
                placeholder="请选择 角色" />
            </Form.Item>
          </Form>
      }
    </Modal>
  )
}
