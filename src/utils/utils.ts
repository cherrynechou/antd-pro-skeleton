import _ from 'lodash';
/**
 * 将树结构转的是成列表形貌（ 树型结构 ）
 * @param trees
 * @param name
 * @param children
 * @param fields
 * 需要递归方式
 */
const treeToOrderList =  (
  trees: any[],
  name: string = 'name',
  children: string = 'children',
  fields: any[] = ['order']) =>
{
  const root = { name: '顶级', id: 0 ,level: 0};
  const rows = [];
  const result: any[] = [];

  rows.push(root);

  const deepTrees = (
    arr: any[],
    level: number = 1
  ) => {
    arr.forEach(item =>{
      const row = Object.assign({}, item,{level:level});
      if(item[children]){
        rows.push(row);
        deepTrees(item[children],level + 1);
      } else {
        rows.push(row);
      }
    });
  }

  const formatLabelName = (level: number) => {
    let str= '';
    for( let i = 0; i < level; ++i){
      str += '-';
    }
    return level == 0 ? '' : '|' + str
  }

  //展开
  deepTrees(trees);

  //格式化树
  rows.forEach(item=>{
    const formatLabel = formatLabelName(item.level);
    const filterFields = _.pick(item,fields);
    result.push({
      label:formatLabel + item[name],
      value:item.id,
      ...filterFields
    })
  })

  return result;
}


/**
 * 生成树型列表(数据是从数据库查询出来的记录)
 * @param trees
 * @param children
 * @param name
 * @param pk
 * @param pid
 * @param root
 * refre: https://www.jb51.net/article/234063.htm
 */
const listToTree=(
  trees: any[],
  children: string = 'children',
  name: string = 'name',
  pk: string='id',
  pid: string = 'parent_id',
  root: number = 0) =>
{
  const results: any[] = [];

  //todolist
  //1.先将数组格式化成目标形式
  const formatTrees: any[] = [];
  trees.forEach((item: any[])=>{
    formatTrees.push({
      id: item[pk],
      title: item[name],
      key: item[pk],
      parent_id: item[pid],
    });
  })

  //2.先生成parent建立父子关系
  const parents = {};
  formatTrees.forEach((item: any[])=>{
    parents[item[pk]] = item;
  })

  //生成最终数据
  formatTrees.forEach((item: any[]) =>{
    const parentId = item[pid];
    if (root == parentId) {
      results.push(item);
    }else{
      if(parents[parentId]){
        parent = parents[parentId];
        if(Object.prototype.toString.call(parent[children]) !== '[object Array]'){
          parent[children]=[];
        }
        parent[children].push( item );
      }
    }
  });

  return results;
}


/**
 * 获取树型结构叶子节点
 * @param trees
 * @param children
 */
const filterTreeLeafNode=(
  trees: any[],
  children: string = 'children',) =>
{
  const leafRecords: any[] = [];
  const expandTree = (
    arr: any[]
  )=>{
    arr.forEach((item: any)=>{
      if(item[children]){
        expandTree(item[children]);
      }else{
        leafRecords.push(item);
      }
    })
  }

  expandTree(trees);

  return leafRecords;
}

/**
 * 获取数组某一列最大值
 * @param list
 * @param field
 */
const queryListMaxValue=(
  list: any[],
  field: string=''
)=>{
  const sortListValues = list.map((item: any) => {return item[field]});
  const sort_max_array: number[] = [];
  sortListValues.forEach((item: any) => {
    if(item){
      sort_max_array.push(item);
    }
  })

  return Math.max(...sort_max_array);
}

export {
  treeToOrderList,
  listToTree,
  queryListMaxValue,
  filterTreeLeafNode
}

