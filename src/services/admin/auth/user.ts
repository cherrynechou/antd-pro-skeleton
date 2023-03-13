import  request  from '@/utils/request';

/**
 * 当前用户
 */
export function currentUser(){
  return request.get('/admin/currentUser');
}

/**
 * 获取用户列表
 */
export function queryUsers(params: any = {}){
  return request.get('/admin/auth/users', {
    params
  });
}


/**
 * 添加用户
 * @param params
 */
export function createUser(params: any = {}){
  return request.post('/admin/auth/users', params)
}


/**
 * 当前查询用户
 * @param id
 */
export function getUser(id: number){
  return request.get(`/admin/auth/users/${id}`);
}

/**
 * 更新用户
 * @param id
 * @param params
 */
export function updateUser(id: number,params: any= {}) {
  return request.put(`/admin/auth/users/${id}`,params);
}

/**
 * 删除用户
 * @param id
 */
export function destroyUser(id: number){
  return request.delete(`/admin/auth/user/${id}`);
}

/**
 * 禁用用户登录
 */
export function blockUser(id: number) {
  return request.patch(`/admin/user/${id}/block`);
}

/**
 * 重置用户密码
 * @param id
 */
export function resetPassword(id: number){
  return request.patch(`/admin/user/${id}/resetPassword`);
}
