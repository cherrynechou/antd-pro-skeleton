import request from "@/utils/request";

/**
 * 登录
 * @param params
 */
export function login(params: any = {}) {
  return request.post('/admin/oauth/login',  params );
}


/**
 * 获取当前用户菜单列表
 */
export function getMenuList( ) {
  return request.get('/admin/getMenuList' );
}

/**
 * 上传文件
 * @param params
 */
export function uploadFile(params: any = {}) {
  return request.post('/admin/upload/files', params);
}


/**
 * 清除缓存
 */
export function clearCache(){
  return request.get('/admin/cache/clear');
}
