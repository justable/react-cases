import { useState, useEffect, useRef, useMemo } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { isBrowser } from 'umi';
import { Util, TreeGraph, Minimap, NodeConfig, GraphOptions } from '@antv/g6';
import { mockData, uuid, GraphNode } from './data';
import Icon from '@/components/Icon';
import styles from './style.less';

type DataSource = GraphNode;

interface AdvancedGraph {
  dataSource?: DataSource;
  visible: boolean;
}

const colorPanel = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
];
/**
 * format the string
 * @param {string} str The origin string
 * @param {number} maxWidth max width
 * @param {number} fontSize font size
 * @return {string} the processed result
 */
const fittingString = (
  str: string,
  maxWidth: number,
  fontSize: number,
): string => {
  const ellipsis = '...';
  const ellipsisLength = Util.getTextSize(ellipsis, fontSize)[0];
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) return;
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize;
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.substr(0, i)}${ellipsis}`;
    }
  });
  return res;
};
const globalFontSize = 12;

const App: React.FC = () => {
  const [total, setTotal] = useState<number>();
  const [dataSource, setDataSource] = useState<DataSource>();
  const [advancedGraph, setAdvancedGraph] = useState<AdvancedGraph>({
    visible: false,
  });
  const [advancedListVisible, setAdvancedListVisible] = useState(false);
  const [advancedListData, setAdvancedListData] = useState<DataSource>();

  const stashSubtrees = useRef<Record<string, any>>({});

  const [mountRef] = useCreateGraph(
    {
      hooks: {
        afterCreate(g) {
          function handleFocusNode(e: any) {
            const item = e.item;
            g.focusItem(item, true, {
              easing: 'easeCubic',
              duration: 500,
            });
          }

          function handleShowAdvancedGraph(e: any) {
            const item = e.item;
            const data = item.getModel();
            if (data.isAdvancedInstance) {
              setAdvancedGraph({
                dataSource: data,
                visible: true,
              });
            } else if (data.isEllipsis) {
              setAdvancedListVisible(true);
              setAdvancedListData(item._cfg.parent.getModel());
            }
          }
          let centerX = 0;
          g.node(function (node: any) {
            if (node.isRoot) {
              centerX = node.x;
            }
            const result: any = {
              label: node.name,
              labelCfg: {
                style: {
                  fontSize: 12,
                },
              },
            };
            if (node.isRoot) {
              result.size = 120;
              result.label = fittingString(node.name, 120, globalFontSize);
              result.style = {
                fill: '#fa8c16',
                stroke: '#fa8c16',
                lineWidth: 2,
              };
            } else if (node.isVirtual) {
              result.size = 40;
              result.label = fittingString(node.name, 40, globalFontSize);
              result.style = {
                stroke: '#73c0de',
                lineWidth: 2,
                lineDash: [5, 2],
              };
            } else if (node.isAdvancedInstance) {
              result.size = 20;
              // result.label = fittingString(node.name, 20, globalFontSize);
              // Object.assign(result.labelCfg, {
              //   position:
              //     node.children && node.children.length > 0
              //       ? 'left'
              //       : node.x > centerX
              //       ? 'right'
              //       : 'left',
              //   offset: 5,
              // });
              result.style = {
                fill: '#ee6666',
                stroke: '#ee6666',
                lineWidth: 2,
                cursor: 'pointer',
              };
            } else if (node.isEllipsis) {
              result.size = 20;
              result.label = fittingString(node.name, 20, globalFontSize);
              result.style = {
                fill: '#91cc75',
                stroke: '#91cc75',
                lineWidth: 2,
                cursor: 'pointer',
              };
            } else {
              result.size = 5;
              // result.label = fittingString(node.name, 5, globalFontSize);
              result.style = {
                fill: '#9a60b4',
                stroke: '#9a60b4',
                lineWidth: 2,
              };
            }
            return result;
          });

          g.on('node:click', (e: any) => {
            // handleFocusNode(e);
            handleShowAdvancedGraph(e);
          });
        },
        processingData(d) {
          Util.traverseTree(d, (subtree: NodeConfig) => {
            if (subtree.isAdvancedInstance) {
              subtree.collapsed = true;
            }
          });
        },
        afterRender(g) {
          g.fitView(50);
        },
      },
    },
    [dataSource],
  );
  const [mountRef2] = useCreateGraph(
    {
      mergeConfig(options) {},
      hooks: {
        afterCreate(g) {
          let centerX = 0;
          g.node(function (node: any) {
            if (node.isAdvancedInstance) {
              centerX = node.x;
            }
            const result: any = {
              label: node.name,
              labelCfg: {
                position:
                  node.children && node.children.length > 0
                    ? 'left'
                    : node.x > centerX
                    ? 'right'
                    : 'left',
                offset: 5,
              },
            };
            if (node.isAdvancedInstance) {
              result.size = 120;
              result.style = {
                fill: '#fa8c16',
                stroke: '#fa8c16',
                lineWidth: 2,
                cursor: 'pointer',
              };
            } else {
              result.size = 20;
              result.style = {
                fill: '#ee6666',
                stroke: '#ee6666',
                lineWidth: 2,
                cursor: 'pointer',
              };
            }
            return result;
          });
        },
        processingData(d) {
          Util.traverseTree(d, (subtree: NodeConfig) => {
            if (subtree.isAdvancedInstance) {
              subtree.collapsed = false;
            }
          });
        },
        afterRender(g) {
          const container = mountRef2.current!;
          g.changeSize(container.scrollWidth, container.scrollHeight);
          g.fitView(100);
        },
      },
    },
    [advancedGraph.dataSource],
  );

  useEffect(() => {
    setTimeout(() => {
      const d = mockData('tree');
      const visibleCount = calulateVisibleCount(d.treeRootNode!);
      Util.traverseTreeUp(d.treeRootNode, (subtree: NodeConfig) => {
        // stash the origin children for the subtree to be pruned
        if (
          subtree.isVirtual &&
          subtree.children &&
          subtree.children.length > visibleCount
        ) {
          subtree.overflow = true;
          const stashChildren: NodeConfig[] = [];
          subtree.children.forEach((child) => {
            stashChildren.push(Object.assign({}, child));
          });
          stashSubtrees.current[subtree.id] = {
            oriChildren: stashChildren,
            curBeginIdx: 0,
            curEndIdx: visibleCount,
          };
        }
      });

      // pruning the tree
      Util.traverseTree(d.treeRootNode, (subtree: NodeConfig) => {
        if (subtree.overflow && subtree.children) {
          subtree.children = subtree.children.slice(0, visibleCount).concat({
            id: uuid(),
            name: '省略号',
            isEllipsis: true,
          });
        }
      });
      setDataSource(d.treeRootNode);
      setTotal(d.total);
    }, 1000);
  }, []);

  return (
    <>
      <div className={styles.graphContainer} ref={mountRef}>
        {total && (
          <div className={styles.graphNodeSummary}>
            一共
            <span className={styles.graphNodeSummaryHighlight}>{total}</span>
            个节点
          </div>
        )}
      </div>
      <div
        className={classNames(styles.graphContainer2, {
          [styles.graphContainer2Active]: advancedGraph.visible,
        })}
        ref={mountRef2}
      >
        <div
          className={styles.graphContainer2Close}
          onClick={() => {
            setAdvancedGraph({
              visible: false,
            });
            setAdvancedListVisible(false);
          }}
        >
          <Icon type="close"></Icon>
        </div>
      </div>
      <AdvancedList
        visible={advancedListVisible}
        onClick={(d) => {
          setAdvancedGraph({
            dataSource: d,
            visible: true,
          });
        }}
        getDataSource={() => {
          if (advancedListData) {
            return (
              stashSubtrees.current[advancedListData.id]?.oriChildren ||
              advancedListData.children
            );
          }
        }}
      />
    </>
  );
};

interface CreateGraphHooks {
  afterCreate?: (g: TreeGraph) => void;
  processingData?: (g: DataSource) => void;
  afterRender?: (g: TreeGraph) => void;
}

interface CreateGraphOptions {
  mergeConfig?: (c: GraphOptions) => void;
  hooks: CreateGraphHooks;
}

function useCreateGraph(
  options: CreateGraphOptions,
  deps: [DataSource | undefined],
): [React.RefObject<HTMLDivElement>, React.RefObject<TreeGraph | undefined>] {
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<TreeGraph>();

  useEffect(() => {
    if (!insRef.current) {
      const container = containerRef.current!;
      // const minimap = new Minimap({
      //   size: [150, 100],
      // });
      const config: GraphOptions = {
        container,
        width: container.scrollWidth,
        height: container.scrollHeight,
        linkCenter: true,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: (item, collapsed) => {
                const data = item!.get('model');
                data.collapsed = collapsed;
                return true;
              },
              shouldBegin: (e) => {
                // 若当前操作的节点 id 为 'node1'，则不发生 collapse-expand
                if (e.item && e.item.getModel().isAdvancedInstance) {
                  return false;
                }
                return false;
              },
            },
            {
              type: 'tooltip',
              formatText: (model) => {
                return model.name as string;
              },
              offset: 10,
            },
            'drag-canvas',
            'zoom-canvas',
            // 'activate-relations',
          ],
        },
        defaultNode: {
          size: 26,
        },
        defaultEdge: {
          type: 'line',
        },
        layout: {
          type: 'compactBox',
          direction: 'RL',
          getId: function getId(d: DataSource) {
            return d.id;
          },
          getHeight: (node: NodeConfig) => {
            if (node.isAdvancedInstance || node.isEllipsis) {
              return _.random(42, 62);
            }
            return 26;
          },
          getWidth: (node: NodeConfig) => {
            if (node.isAdvancedInstance || node.isEllipsis) {
              return _.random(42, 62);
            }
            return 26;
          },
          getVGap: (node: NodeConfig) => {
            if (node.isAdvancedInstance || node.isEllipsis) {
              return _.random(30, 50);
            }
            return 20;
          },
          getHGap: (node: NodeConfig) => {
            if (node.isAdvancedInstance || node.isEllipsis) {
              return _.random(50, 70);
            }
            return 30;
          },
          radial: true,
        },
      };

      if (options.mergeConfig) {
        options.mergeConfig(config);
      }
      insRef.current = new TreeGraph(config);

      const graphInstance = insRef.current;
      graphInstance.get('canvas').set('localRefresh', false);

      graphInstance.on('wheelzoom', (e) => {
        e.stopPropagation();
        // 这里的 className 根据实际情况而定，默认是 g6-component-tooltip
        const tooltips = Array.from(
          document.getElementsByClassName('g6-node-tooltip'),
        );
        tooltips.forEach((tooltip) => {
          let tip: HTMLElement = tooltip as HTMLElement;
          if (tooltip && tip.style) {
            tip.style.transform = `scale(${graphInstance.getZoom()})`;
          }
        });
      });

      options.hooks.afterCreate?.(graphInstance);

      if (isBrowser()) {
        window.onresize = () => {
          const container = containerRef.current!;
          const graphIns = insRef.current;
          if (!graphIns || graphIns.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight)
            return;
          graphIns.changeSize(container.scrollWidth, container.scrollHeight);
        };
      }
    }
  }, []);

  useEffect(() => {
    if (!_.isEmpty(deps[0])) {
      const graphIns = insRef.current!;
      options.hooks.processingData?.(deps[0]!);
      graphIns.data(deps[0]);
      graphIns.render();
      options.hooks.afterRender?.(graphIns);
    }
  }, deps);

  return [containerRef, insRef];
}

interface AdvancedListProps {
  visible: boolean;
  getDataSource: () => DataSource[];
  onClick: (d: DataSource) => void;
}
const AdvancedList: React.FC<AdvancedListProps> = ({
  visible,
  getDataSource,
  onClick,
}) => {
  const dataSource = getDataSource();
  return (
    <div
      className={classNames(styles.advancedListContainer, {
        [styles.advancedListContainerActive]: visible,
      })}
    >
      {dataSource?.map((item) => {
        return (
          <div
            key={item.id}
            className={styles.advancedListItem}
            onClick={() => {
              onClick(item);
            }}
          >
            {item.name}
          </div>
        );
      })}
    </div>
  );
};

function calulateVisibleCount(dataSource: DataSource) {
  if (dataSource?.children?.length) {
    return Math.floor(50 / dataSource.children.length);
  }
  return 0;
}

export default App;
