import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import fixMenuItemIcon from '@/utils/fixMenuItemIcon';
import { getLocalStorage } from '@/utils/LocalStorage';
import { currentUser as queryCurrentUser } from './services/admin/auth/user';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { getMenuList } from "@/services/admin/system/common";

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/admin/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export type menuProType={
  isUrl: any;
  path: any;
  target: string;
  pro_layout_parentKeys: string | any[];
  icon: any;
};


/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    menu: {
      // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
      params: {
        username: initialState?.currentUser?.username,
      },
      request: async () => {
        const menuData = await getMenuList();
        return fixMenuItemIcon(menuData.data);
      },
    },
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: async () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      const token = await getLocalStorage('access_token');
      if (!initialState?.currentUser && token && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    ...initialState?.settings,
    menuItemRender: (menuItemProps: menuProType, defaultDom: any)  => {
      if (menuItemProps.isUrl || !menuItemProps.path) {
        return defaultDom;
      }
      // 支持二级菜单显示icon
      return (
        menuItemProps.target ? <Link to={menuItemProps.path} target={ menuItemProps.target }>
          {menuItemProps.pro_layout_parentKeys &&
          menuItemProps.pro_layout_parentKeys.length > 1 &&
          menuItemProps.icon}
          {defaultDom}
        </Link> : <Link to={menuItemProps.path}>
          {menuItemProps.pro_layout_parentKeys &&
          menuItemProps.pro_layout_parentKeys.length > 1 &&
          menuItemProps.icon}
          {defaultDom}
        </Link>
      );
    },
  };
};
