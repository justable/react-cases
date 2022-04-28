import { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { isBrowser } from 'umi';
import { TreeGraph } from '@antv/g6';
import { mockData, GraphNode } from './data';

const App: React.FC = () => {
  const [total, setTotal] = useState<number>();
  const [dataSource, setDataSource] = useState<GraphNode>();

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
      console.log('dataSource', mockData());
      const d = mockData();
      console.log('total', d.total);
      setDataSource(d.data);
      setTotal(d.total);
    }, 1000);
  }, []);

  return <div ref={containerRef} style={{ height: '100%' }}></div>;
};

interface CreateGraphHooks {
  afterCreate?: () => void;
  beforeRender?: (d: GraphNode) => void;
  afterRender?: (d: GraphNode) => void;
}
function useCreateGraph(
  hooks: CreateGraphHooks,
  deps: [GraphNode | undefined],
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<TreeGraph>();

  useEffect(() => {
    if (!insRef.current) {
      const container = containerRef.current!;
      insRef.current = new TreeGraph({
        container,
        width: container.scrollWidth,
        height: container.scrollHeight,
        linkCenter: false,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange(item, collapsed) {
                const data = item!.get('model');
                data.collapsed = collapsed;
                return true;
              },
            },
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        defaultNode: {
          size: 26,
        },
        layout: {
          type: 'compactBox',
          direction: 'RL',
          getId: function getId(d: GraphNode) {
            return d.id;
          },
          getHeight: () => {
            return 26;
          },
          getWidth: () => {
            return 26;
          },
          getVGap: () => {
            return 20;
          },
          getHGap: () => {
            return 30;
          },
          radial: true,
        },
      });
      insRef.current.node(function (node: any) {
        const label = node.count ? `${node.name}(${node.count})` : node.name;
        const result = {
          id: node.id,
          label,
        };
        if (!node.children && (node.refs || node.attachments)) {
          node.children = [...node.refs, ...node.attachments];
        }
        return result;
      });

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
    if (!_.isEmpty(deps[0])) {
      const graphIns = insRef.current!;
      hooks.beforeRender?.(deps[0]!);
      graphIns.data(deps[0]);
      graphIns.render();
      graphIns.fitView();
    }
  }, deps);

  return [containerRef];
}

export default App;
