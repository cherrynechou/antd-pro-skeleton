const setLocalStorage = async (key: string, value: string) => {
  await localStorage.setItem(key, value);
};
const getLocalStorage = async (key: string) => {
  return await localStorage.getItem(key);
};
const removeLocalStorage = async (key: string) => {
  return await localStorage.removeItem(key);
};
export { setLocalStorage, getLocalStorage, removeLocalStorage };
