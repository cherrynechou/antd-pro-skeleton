import axios,{ AxiosInstance,AxiosResponse ,AxiosError, InternalAxiosRequestConfig, HttpStatusCode } from 'axios';
import { history } from 'umi';
import { setLocalStorage, getLocalStorage } from '@/utils/LocalStorage';
import { API_USER_LOGIN } from '@/constants/api'

const request: AxiosInstance =  axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * 获取凭证
 */
const getAccessToken = async () =>{
  const access_token = await getLocalStorage('access_token');
  const token_type = await getLocalStorage('token_type');

  if (!token_type || !access_token) {
    return '';
  }

  return `${token_type} ${access_token}`;
}


/**
 * 设置凭证
 * @param data
 */
const setAccessToken = async (data: any) =>{
  await setLocalStorage('access_token', data.access_token);
  await setLocalStorage('token_type', data.token_type);
}

/**
 * 请求
 */
request.interceptors.request.use(async (config: InternalAxiosRequestConfig) =>{

  const accessToken = await getAccessToken();

  if(accessToken && config && config?.headers){
    config.headers.Authorization = accessToken;
  }

  //删除属性值 为空 或者 undefined
  if(config.data){
    Object.keys(config.data).forEach((val: string) => {
      if( config.data[val] === null || config.data[val] === undefined){
        delete config.data[val]
      }
    });
  }

  return config;

}, (error:AxiosError) => {
  return Promise.reject(error);
});


/**
 * 响应
 */
request.interceptors.response.use(async (response: AxiosResponse)=>{

  const { data } = response.data;

  if(response.config.url === API_USER_LOGIN){
    await setAccessToken(data);
  }

  if(response.status === HttpStatusCode.Ok){
    return response.data;
  }

  return Promise.reject(response?.data);

}, (error: AxiosError) => {

  if(error?.response?.status === 403){

    history.replace({
      pathname: '/error/403',
    });
  }
  return Promise.reject(error)
});


export default request;
