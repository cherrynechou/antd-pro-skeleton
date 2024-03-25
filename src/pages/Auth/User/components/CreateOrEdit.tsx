import { 
  useEffect, 
  useState 
} from 'react';
import { 
  queryAllRoles
   } from '@/services/admin/auth/role';
import { 
  getUser, 
  createUser, 
  updateUser 
} from '@/services/admin/auth/user';
import {
  queryAllPermissions
} from '@/services/admin/auth/permission';
import { 
  uploadImageFile 
} from '@/services/admin/system/common';
import { 
  PlusOutlined 
} from '@ant-design/icons';
import { 
  Modal, 
  Skeleton, 
  Form, 
  Input, 
  Upload, 
  Select,
  message 
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile, UploadProps } from 'antd/es/upload';
import lodash from 'lodash';

import {
  filterTreeLeafNode,
  listToTree
} from "@/utils/utils";

import '@/styles/auth.less';

export default (props: any) => {
  const [initialValues, setInitialValues] = useState<any>({});
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [roles, setRoles] = useState<any>([]);
  const [treeData, setTreeData] = useState<any>([]);
  const [treeLeafRecord, setTreeLeafRecord] = useState<any>([]);
  const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<any>([]);
  const [userRoles,setUserRoles] = useState<any>([]);
  const {isModalVisible, isShowModal, editId, actionRef} = props;

  const [form] = Form.useForm();

  const title = editId === undefined ? '添加' : '编辑';

  const fetchApi = async () => {

    const roleRes = await queryAllRoles();
    if (roleRes.status === 200) {
      const _roleData = roleRes.data;
      const _roleList: any[] = [];
      _roleData.forEach((item: any) => {
        _roleList.push({ label: item.name, value: item.id });
      });
      setRoles(_roleList);
    }

    const permissionAllRes = await queryAllPermissions();
    if(permissionAllRes.status === 200){
      const _permissionData = permissionAllRes.data;
      const listTreePermissionData = listToTree(_permissionData)
      setTreeData(listTreePermissionData);
      setTreeLeafRecord(filterTreeLeafNode(listTreePermissionData))
    }


    if (editId !== undefined) {
      const userRes = await getUser(editId);
      if (userRes.status === 200) {
        const currentData = userRes.data;

        const roleList: any[] = [];
        currentData.roles.forEach((item: any) => {
          roleList.push(item.id);
        });

        setFileList([
          {
            uid: currentData.id,
            name: '',
            status: 'done',
            url: currentData.avatar_url,
          },
        ]);

        let _permissionList: any[] = [];
        if(currentData.permissions.length>0){
          _permissionList = currentData.permissions.map((item: any)=>{return item.id});
        }

        let _roleList: any[] = [];
        if(currentData.roles.length>0){
          _roleList= currentData.roles.map((item: any)=>{return item.slug});
          setUserRoles(_roleList);
        }

        setDefaultCheckedKeys(_permissionList);

        setInitialValues({
          username: currentData.username,
          name: currentData.name,
          avatar: currentData.avatar,
          roles: roleList,
          permissions:JSON.stringify(_permissionList)
        });
      }
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  /**
   * 提交
   */
  const handleOk = async () => {
    const fieldsValue = await form.validateFields();

    //去掉 confirm
    const fieldsPostValue = lodash.pick(fieldsValue, [
      'name',
      'username',
      'avatar',
      'roles',
      'password',
      'permissions'
    ]);

    let response = {};
    if (editId === undefined) {
      response = await createUser(fieldsPostValue);
    } else {
      response = await updateUser(editId, fieldsPostValue);
    }

    // @ts-ignore
    if (response.status === 200) {
      isShowModal(false);
      message.success('更新成功');
      actionRef.current.reload();
    }
  };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleCancel = () => setPreviewOpen(false);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>添加文件</div>
    </div>
  );


  /**
   * 上传之前
   */
  const handleBeforeUpload = async (file: any) => {
    const allowFormat = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!allowFormat) {
      message.error('只允许 JPG/PNG 文件!', 1000);
      return false;
    }

    if(file.type == 'image/jpeg'){
      setFileExtension('jpg');
    }else if(file.type == 'image/png'){
      setFileExtension('png');
    }

    return allowFormat ;
  }

  /**
   *
   * @param options
   */
  const handleCustomUpload = async (options: any) => {
    const { file，onProgress } = options;
    onProgress({ percent: 50 });

    getBase64(file).then((r: any) => {
      const index = r.indexOf('base64');
      const fileData = r.substring(index + 7);

      const formData = {
        extension: fileExtension,
        fileData: fileData
      }

      uploadImageFile(formData).then((response: any) => {
        if (response.status === 200) {

          setFileList([
            {
              uid: '1',
              name: '',
              status: 'done',
              url: response.data.remotePath,
            }
          ]);

          form.setFieldsValue({
            avatar:response.data.path
          });

          message.success('上传成功');
        }
      });
    });
  };


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


  return (
    <Modal
      title={title}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => isShowModal(false)}
      destroyOnClose
      width={750}
    >
      {Object.keys(initialValues).length === 0 && editId !== undefined ? (<Skeleton paragraph={{ rows: 4 }} />) : (
        <Form form={form} initialValues={initialValues} autoComplete="off">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '用户名是必填项！' }]}
          >
            <Input placeholder="请输入 用户名" />
          </Form.Item>

          <Form.Item
            name="name"
            label="名 称"
            rules={[{ required: true, message: '名称是必填项！' }]}
          >
            <Input placeholder="请输入 名称" />
          </Form.Item>

          <Form.Item name="avatar" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item label="头像">
            <Upload
              accept="image/*"
              listType="picture-card"
              fileList={fileList}
              customRequest={ handleCustomUpload }
              beforeUpload = {handleBeforeUpload}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Form.Item>

          {/*添加*/}
          {editId === undefined && (
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
                      if (value.length >= 6) {
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
          )}

          {/*编辑*/}
          {editId !== undefined && (
            <>
              <Form.Item name="password" label="密码" hasFeedback>
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirm"
                label="确认密码"
                dependencies={['password']}
                hasFeedback
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue('password') === value) {
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
          )}

          <Form.Item
            name="roles"
            label="角色"
            rules={[{ required: true, message: '名称是必填项！' }]}
          >
            <Select mode="multiple" options={roles} placeholder="请选择 角色" />
          </Form.Item>

          {!userRoles.includes('administrator') && <>
            <Form.Item
              name="permissions"
              hidden
            >
              <Input
                hidden
              />
            </Form.Item>

            <Form.Item
              label="权限"
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
          </>
          }

        </Form>
      )}
    </Modal>
  );
};
