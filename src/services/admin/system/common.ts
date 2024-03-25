import request from '@/utils/request';

/**
 * 登录
 * @param params
 */
export function login(params: any = {}) {
  return request.post('/oauth/login', params);
}

/**
 * 获取当前用户菜单列表
 */
export function getMenuList() {
  return request.get('/getMenuList');
}

/**
 * 上传图片文件
 * @param params
 */
export function uploadImageFile(params: any = {}) {
  return request.post('/upload/imageFiles', params);
}


/**
 *  excel上传 
 */
export function uploadExcelFile(params: any = {}){
  return request.post('/upload/excelFiles', params);
}

/**
 * 清除缓存
 */
export function clearCache() {
  return request.get('/cache/clear');
}
