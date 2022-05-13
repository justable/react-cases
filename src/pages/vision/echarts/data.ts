import _ from 'lodash';

type InstanceType =
  | '发票'
  | '承兑汇票'
  | '银行回单'
  | '银行流水'
  | '综合业务'
  | '采购业务'
  | '报销业务'
  | '销售业务'
  | '物流业务'
  | '库存业务';

type ReimbursementVersion = '旗舰版' | '国际版';

type ReimbursementType =
  | '报销单'
  | '申请单'
  | '对公支付'
  | '借款单'
  | '合同'
  | '对公收款'
  | '还款单';

type InstanceBehavior = 'structure' | 'relation' | 'image';

type FileType = 'png' | 'jpg' | 'pdf' | 'ofd';

interface BaseNode {
  id: string;
  name: string;
  children?: GraphNode[];
}

interface AttachmentNode extends BaseNode {
  isAttachment: boolean;
  filePath: string;
  fileType: FileType;
}

interface InstanceNode extends BaseNode {
  isInstance: boolean;
  // 是否自定义单据
  isCustom: boolean;
  // 单据类型
  instanceType: InstanceType;
  // 国际版｜旗舰版
  reimbursementVersion?: ReimbursementVersion;
  // 报销单类型
  reimbursementType?: ReimbursementType;
}

interface AdvancedInstanceNode extends InstanceNode {
  isAdvancedInstance: boolean;
  // 结构化数据｜关系｜影像
  behavior: InstanceBehavior;
  // 关联单据
  refs: InstanceNode[];
  // 相关附件
  attachments: AttachmentNode[];
}

interface VirtualNode extends BaseNode {
  isVirtual: boolean;
  count: number;
}

interface RootNode extends BaseNode {
  isRoot: boolean;
}

export type GraphNode =
  | RootNode
  | VirtualNode
  | AdvancedInstanceNode
  | InstanceNode
  | AttachmentNode;

let total = 0;

function uuid(prefix?: string) {
  total = total + 1;
  return _.uniqueId(prefix);
}

function randomOne(arr: string[]) {
  const idx = _.random(0, arr.length - 1);
  return arr[idx];
}

function createInstanceNode(instanceType?: string): InstanceNode {
  const normalType = ['发票', '承兑汇票', '银行回单', '银行流水'];
  const type =
    instanceType ||
    randomOne([
      ...normalType,
      '综合业务',
      '采购业务',
      '报销业务',
      '销售业务',
      '物流业务',
      '库存业务',
    ]);
  const uid = uuid(`${type}_`);
  const result: InstanceNode = {
    id: uid,
    name: uid,
    isInstance: true,
    isCustom: !normalType.includes(type),
    instanceType: type as InstanceType,
  };
  if (type === '报销业务') {
    result.reimbursementVersion = randomOne([
      '旗舰版',
      '国际版',
    ]) as ReimbursementVersion;
    result.reimbursementType = randomOne([
      '报销单',
      '申请单',
      '对公支付',
      '借款单',
      '合同',
      '对公收款',
      '还款单',
    ]) as ReimbursementType;
  }
  return result;
}

function createAttachmentNode(): AttachmentNode {
  const uid = uuid('附件_');
  return {
    id: uid,
    name: uid,
    isAttachment: true,
    filePath: `/static/附件${uid}`,
    fileType: randomOne(['png', 'jpg', 'pdf', 'ofd']) as FileType,
  };
}

function createAdvancedInstanceNode(
  instanceType: string,
): AdvancedInstanceNode {
  const node = createInstanceNode(instanceType);
  const refs = new Array(_.random(0, 2)).fill(null).map(() => {
    return createInstanceNode();
  });
  const attachments = new Array(_.random(0, 2)).fill(null).map(() => {
    return createAttachmentNode();
  });
  const children = [...refs, ...attachments];
  const result: AdvancedInstanceNode = {
    ...node,
    isAdvancedInstance: true,
    behavior: randomOne(['structure', 'relation', 'image']) as InstanceBehavior,
    refs,
    attachments,
  };
  if (children.length) {
    result.children = children;
  }
  return result;
}

function createVirtualNode(
  props: Pick<VirtualNode, 'name' | 'count'>,
): VirtualNode {
  const { name: instanceType, count } = props;
  const uid = uuid(`${instanceType}_`);
  const children = new Array(count).fill(null).map(() => {
    return createAdvancedInstanceNode(instanceType);
  });
  return {
    id: uid,
    name: instanceType,
    isVirtual: true,
    count,
    children,
  };
}

function createRootNode(): RootNode {
  const uid = uuid('凭证_');
  const children = [
    createVirtualNode({ name: '发票', count: 1 }),
    createVirtualNode({ name: '承兑汇票', count: 2 }),
    createVirtualNode({ name: '银行回单', count: 5 }),
    createVirtualNode({ name: '银行流水', count: 2 }),
    createVirtualNode({ name: '综合业务', count: 1 }),
    createVirtualNode({ name: '采购业务', count: 2 }),
    createVirtualNode({ name: '报销业务', count: 1 }),
    createVirtualNode({ name: '销售业务', count: 2 }),
    createVirtualNode({ name: '物流业务', count: 1 }),
    createVirtualNode({ name: '库存业务', count: 2 }),
  ];
  return {
    id: uid,
    name: uid,
    isRoot: true,
    children,
  };
}

interface GraphLink {
  source: string;
  target: string;
}

interface GraphCategory {
  name: string;
}

export interface GraphDataResponse {
  total: number;
  treeRootNode?: GraphNode;
  categories?: GraphCategory[];
  nodes?: GraphNode[];
  links?: GraphLink[];
}

function transformTreeNode(node: RootNode) {
  let nodes: GraphNode[] = [];
  let links: GraphLink[] = [];

  function _transformTreeNode(n: GraphNode, parentId: string) {
    nodes.push(Object.assign({}, n, { children: [] }));
    if (n.id !== parentId) {
      links.push({
        source: n.id,
        target: parentId,
      });
    }

    n.children?.forEach((item) => {
      _transformTreeNode(item, n.id);
    });
  }

  _transformTreeNode(node, node.id);

  return {
    nodes,
    links,
    categories: [
      { name: '发票' },
      { name: '承兑汇票' },
      { name: '银行回单' },
      { name: '银行流水' },
      { name: '综合业务' },
      { name: '采购业务' },
      { name: '报销业务' },
      { name: '销售业务' },
      { name: '物流业务' },
      { name: '库存业务' },
    ],
  };
}

export function mockData(mode?: string): GraphDataResponse {
  const treeNode = createRootNode();
  const result: GraphDataResponse = {
    total,
  };

  if (mode === 'tree') {
    result.treeRootNode = treeNode;
  } else {
    Object.assign(result, transformTreeNode(treeNode));
  }

  total = 0;
  return result;
}
