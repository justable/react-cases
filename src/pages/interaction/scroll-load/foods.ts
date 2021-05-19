export interface Food {
  type: 'fruit' | 'other';
  color: string;
  name: string;
  tag: string;
}

const foods: Food[] = [
  {
    type: 'fruit',
    color: '#EB674A',
    name: '苹果',
    tag: '红色',
  },
  {
    type: 'fruit',
    color: '#EBC62E',
    name: '香蕉',
    tag: '黄色',
  },
  {
    type: 'fruit',
    color: '#EB6800',
    name: '橘子',
    tag: '橙色',
  },
  {
    type: 'fruit',
    color: '#436B3D',
    name: '西瓜',
    tag: '绿色',
  },
  {
    type: 'fruit',
    color: '#EBC62E',
    name: '芒果',
    tag: '黄色',
  },
  {
    type: 'fruit',
    color: '#EB674A',
    name: '樱桃',
    tag: '红色',
  },
  {
    type: 'other',
    color: '#5E62EB',
    name: '饼干',
    tag: '黑色',
  },
  {
    type: 'other',
    color: '#5E62EB',
    name: '泡面',
    tag: '黑色',
  },
  {
    type: 'other',
    color: '#5E62EB',
    name: '薯片',
    tag: '黑色',
  },
];

export default foods;
