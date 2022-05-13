import _ from 'lodash';
import {
  calculateCircularCoords,
  calculateSectorCoords,
  Coordinate,
} from '@/utils';

export type BusinessType =
  | '凭证'
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

type BusinessBehavior = 'structure' | 'relation' | 'image';

type FileType = 'png' | 'jpg' | 'pdf' | 'ofd';

export interface GraphNode extends Coordinate {
  id: string;
  name: string;
  symbolSize: number;
  value: number;
  category: number;
}

export interface BusinessNode extends GraphNode {
  level?: number;
  behavior?: BusinessBehavior;
  isRef?: boolean;
  isAttachment?: boolean;
  reimbursementVersion?: ReimbursementVersion;
  reimbursementType?: ReimbursementType;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphCategory {
  name: string;
}

type LayoutCategory = 'circular' | 'sector' | string;

interface CreateLayoutCoordsOptions {
  // 与根节点的间隔
  radius?: number;
  // 生成子节点数量
  childCount?: number;
  // 生成子节点半径
  childRadius?: number;
}

let total = 0;

function randomOne(arr: string[]) {
  const idx = _.random(0, arr.length - 1);
  return arr[idx];
}

function uuid(prefix?: string) {
  total = total + 1;
  return _.uniqueId(prefix);
}

function createLayoutCoords_Circular(
  rootNode: BusinessNode,
  options: Required<CreateLayoutCoordsOptions>,
): [BusinessNode[], GraphLink[]] {
  const resolvedOptions: Required<CreateLayoutCoordsOptions> = Object.assign(
    {
      radius: 30,
      childCount: 0,
      childRadius: 0,
    },
    options,
  );

  const nodes = calculateCircularCoords(
    rootNode,
    resolvedOptions.radius,
    resolvedOptions.childCount,
  ).map((item) => {
    return {
      id: uuid(),
      x: item.x,
      y: item.y,
      symbolSize: 2 * resolvedOptions.childRadius,
      name: '',
      value: 0,
      category: 0,
    };
  });

  const links = nodes.map((item) => {
    return {
      source: item.id,
      target: rootNode.id,
    };
  });

  return [nodes, links];
}

function createLayoutCoords_Sector(
  rootNode: BusinessNode,
  options: Required<CreateLayoutCoordsOptions>,
): [BusinessNode[], GraphLink[]] {
  const resolvedOptions: Required<CreateLayoutCoordsOptions> = Object.assign(
    {
      radius: 30,
      childCount: 0,
      childRadius: 0,
    },
    options,
  );
  const nodes = calculateSectorCoords(
    rootNode,
    resolvedOptions.radius,
    resolvedOptions.childCount,
  );
  return [[], []];
}

export function mockGraphData(): [
  BusinessNode[],
  GraphLink[],
  GraphCategory[],
] {
  const rootNode = {
    id: '0',
    name: '凭证001',
    symbolSize: 67,
    x: 0,
    y: 0,
    value: 0,
    category: 0,
    level: 0,
  };
  const nodes_lv0 = [rootNode];
  const businessTypes = [
    '发票',
    '承兑汇票',
    '银行回单',
    '银行流水',
    '综合业务',
    '采购业务',
    '报销业务',
    '销售业务',
    '物流业务',
    '库存业务',
  ];
  const [nodes_lv1, links_lv1] = createLayoutCoords_Circular(rootNode, {
    radius: 60,
    childCount: 10,
    childRadius: 20,
  });
  const nodes_lv2 = [];
  const links_lv2 = [];
  nodes_lv1.forEach((n, i) => {
    n.name = businessTypes[i];
    n.value = i;
    n.category = i + 1;
    const [nodes, links] = createLayoutCoords_Sector(n, {
      radius: 40,
      childCount: _.random(1, 2),
      childRadius: 10,
    });
  });
  return [
    [...nodes_lv0, ...nodes_lv1],
    [...links_lv1],
    ['凭证', ...businessTypes].map((name) => {
      return { name };
    }),
  ];
}
