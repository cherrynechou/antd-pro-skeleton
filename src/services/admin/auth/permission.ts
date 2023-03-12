import  request  from '@/utils/request';

/**
 * 获取权限树型列表
 */
export function queryPermissions() {
  return request.get('/admin/auth/permissions');
}

/**
 * 查询当前权限
 * @param id
 */
export function queryPermission(id: number){
  return request.get(`/admin/auth/permissions/${id}`)
}

/**
 * 创建权限
 * @param params
 */
export function createPermission(params: any = {}){
  return request.post('admin/auth/permissions',params);
}

/**
 * 更新权限
 * @param id
 * @param params
 */
export function updatePermission(id: number,params: any = {}){
  return request.put(`admin/auth/permissions/${id}`, params);
}

/**
 * 生成权限列表
 */
export function queryAllPermissions() {
  return request.get('/admin/permission/all');
}

/**
 * 获取权限路由
 */
export function queryAllPermissionRoutes() {
  return request.get('/admin/permission/routes');
}
