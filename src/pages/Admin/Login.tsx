import {
  Row,
  Form,
  Input,
  Button,
  message
} from 'antd';
import {
  history,
  useIntl,
  useModel
} from 'umi';
import  { UserOutlined, LockOutlined }  from '@ant-design/icons';
import { login } from '@/services/admin/system/common';
import './Login.less';

export default () =>{

  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const onFinish = async (values: API.LoginParams)=>{
    try {
      // 登录
      const msg = await login({ ...values });
      if (msg.status === 200) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }

    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }
  }

  return (
    <div className="login-main">
      <Row
        align="top"
        justify="center"
        className="px-3"
        style={{ minHeight: '100vh', background: '#fff' }}
      >
        <div className="login-box">
          <Form
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '用户名是必填项！' }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined/>}
                placeholder="请输入用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '密码是必填项！' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined/>}
                placeholder="请输入密码"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>

          </Form>
        </div>
      </Row>
    </div>
  )
}
