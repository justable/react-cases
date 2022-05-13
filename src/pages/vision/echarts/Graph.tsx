import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';
import {
  mockGraphData,
  BusinessType,
  BusinessNode,
  GraphLink,
  GraphCategory,
} from './mockGraphData';
import _dataSource from './graphData.json';
import styles from './style.less';

interface GraphDataSource {
  nodes: BusinessNode[];
  links: GraphLink[];
  categories: GraphCategory[];
}

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<ECharts>();
  const [dataSource, setDataSource] = useState<GraphDataSource>();
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
      const [nodes, links, categories] = mockGraphData();
      const input = {
        nodes,
        links,
        categories,
      };
      console.log(nodes);
      // setDataSource(input);
      // setTotal(nodes.length);
      setDataSource(_dataSource);
      setTotal(_dataSource.nodes.length);
    }, 1000);
  }, []);

  useEffect(() => {
    if (dataSource && insRef.current) {
      insRef.current.clear();
      insRef.current.resize();
      const option = {
        tooltip: {},
        legend: [
          {
            data: dataSource.categories?.map(function (a) {
              return a.name;
            }),
          },
        ],
        series: [
          {
            name: 'Les Miserables',
            type: 'graph',
            layout: 'none',
            data: dataSource.nodes,
            links: dataSource.links,
            categories: dataSource.categories,
            roam: true,
            label: {
              show: true,
              position: 'right',
              formatter: '{b}',
            },
            labelLayout: {
              hideOverlap: true,
            },
            scaleLimit: {
              min: 0.4,
              max: 2,
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3,
            },
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
