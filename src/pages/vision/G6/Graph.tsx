import { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { isBrowser } from 'umi';
import { Graph, Minimap } from '@antv/g6';
import { mockData, GraphDataObject } from './data';
import styles from './style.less';

type DataSource = Pick<GraphDataObject, 'nodes' | 'edges'>;

const App: React.FC = () => {
  const [total, setTotal] = useState<number>();
  const [dataSource, setDataSource] = useState<DataSource>();

  const [containerRef] = useCreateGraph(
    {
      afterCreate() {
        console.log('G6 graph created!');
      },
    },
    [dataSource],
  );

  useEffect(() => {
    setTimeout(() => {
      const d = mockData();
      const input = {
        nodes: d.nodes,
        edges: d.edges,
      };
      console.log('dataSource', input);
      console.log('total', d.total);
      setDataSource(input);
      setTotal(d.total);
    }, 1000);
  }, []);

  return (
    <div className={styles.graphContainer} ref={containerRef}>
      {total && (
        <div className={styles.graphNodeSummary}>
          一共<span className={styles.graphNodeSummaryHighlight}>{total}</span>
          个节点
        </div>
      )}
    </div>
  );
};

interface CreateGraphHooks {
  afterCreate?: () => void;
  beforeRender?: (d: DataSource) => void;
  afterRender?: (d: DataSource) => void;
}
function useCreateGraph(
  hooks: CreateGraphHooks,
  deps: [DataSource | undefined],
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<Graph>();

  useEffect(() => {
    if (!insRef.current) {
      const container = containerRef.current!;
      const minimap = new Minimap({
        size: [150, 100],
      });
      insRef.current = new Graph({
        container,
        width: container.scrollWidth,
        height: container.scrollHeight,
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'activate-relations'],
        },
        layout: {
          type: 'radial',
          unitRadius: 70,
          preventOverlap: true,
          strictRadial: false,
        },
        animate: true,
        defaultNode: {
          size: 20,
        },
        plugins: [minimap],
      });
      const graphInstance = insRef.current;
      graphInstance.node(function (node: any) {
        const label = node.count ? `${node.name}(${node.count})` : node.name;
        const result = {
          id: node.id,
          label,
        };
        return result;
      });

      function handleNodeClick(event: any) {
        const item = event.item;
        graphInstance.focusItem(item, true, {
          easing: 'easeCubic',
          duration: 500,
        });
      }

      graphInstance.on('node:click', handleNodeClick);

      hooks.afterCreate?.();

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
    const data = deps[0];
    if (!_.isEmpty(data)) {
      const graphIns = insRef.current!;
      hooks.beforeRender?.(data!);
      // @ts-ignore
      graphIns.data(data);
      graphIns.render();
    }
  }, deps);

  return [containerRef];
}

export default App;
