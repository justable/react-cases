import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';
import { mockData, GraphNode } from './data';
import styles from './style.less';

type DataSource = GraphNode;

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<ECharts>();
  const [dataSource, setDataSource] = useState<DataSource>();
  const [total, setTotal] = useState<number>();

  useEffect(() => {
    if (!insRef.current) {
      insRef.current = echarts.init(containerRef.current!);
      insRef.current.on('click', 'series', function (params) {
        console.log('echarts click series', params);
      });
      window.addEventListener('resize', () => insRef.current!.resize());
    }
    setTimeout(() => {
      console.log('dataSource', mockData('tree'));
      const d = mockData('tree');
      console.log('total', d.total);
      setDataSource(d.treeRootNode);
      setTotal(d.total);
    }, 1000);
  }, []);

  useEffect(() => {
    if (dataSource && insRef.current) {
      insRef.current.clear();
      insRef.current.resize();
      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
        },
        series: [
          {
            type: 'tree',
            data: [dataSource],
            top: '18%',
            bottom: '14%',
            layout: 'radial',
            symbol: 'emptyCircle',
            symbolSize(value: any, params: any) {
              console.log('111', value, params);
              const depth = params.treeAncestors.length - 1;
              if (depth === 1) {
                return 40;
              } else if (depth === 2) {
                return 20;
              } else if (depth === 3) {
                return 10;
              } else if (depth === 4) {
                return 2;
              }
              return 2;
            },
            label: {
              formatter(params: any) {
                console.log(params);
              },
            },
            labelLayout: {
              hideOverlap: true,
            },
            lineStyle: {
              width: 1,
              color: '#ccc',
            },
            initialTreeDepth: 3,
            animationDurationUpdate: 750,
          },
        ],
      };
      insRef.current.setOption(option);
    }
  }, [dataSource]);

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

export default App;
