import { useState, useEffect, useRef, forwardRef, RefAttributes } from 'react';
import { horizontalCenter } from '@/utils';
import { Spin } from 'antd';
import _ from 'lodash';
import foods, { Food } from './foods';
import FilterTool, { onSelectProps } from './components/FilterTool';
import styles from './style.less';
import { Scrollbars } from 'react-custom-scrollbars';
import useMeasure from '@/hooks/useMeasure';

// 80是paddingTop设了80
const scrollBottomThreshold = 80 + 400;
const pageSize = 20;
const FoodItem: React.FC<{ food: Food }> = ({ food }) => {
  return (
    <div
      className={styles.foodItem}
      style={{ backgroundColor: food.color }}
      data-cursor="pointer"
    >
      {food.name}
    </div>
  );
};

interface ScrollSpinProps {
  active: boolean;
}
const ScrollSpin = forwardRef<HTMLDivElement, ScrollSpinProps>((props, ref) => {
  return (
    <div ref={ref} className={styles.scrollSpin}>
      {props.active && <Spin />}
    </div>
  );
});

let foodSnapshot: Food[] = [];

const App: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [spinActive, setSpinActive] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const appendFoods = async () => {
    setSpinActive(true);
    const res = await fetchFoods(pageSize);
    setFoods((prevState) => {
      return (foodSnapshot = [...prevState, ...res]);
    });
    setSpinActive(false);
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    // 触发查询
    if (
      !spinActive &&
      foods.length % pageSize === 0 &&
      wrapperRef.current &&
      wrapperRef.current.scrollHeight -
        wrapperRef.current.scrollTop -
        wrapperRef.current.offsetHeight <=
        scrollBottomThreshold
    ) {
      appendFoods();
    }
  };

  const handleFilterSelected = (props: onSelectProps) => {
    if (props.filterBy === 'foodType') {
      setFoods(foodSnapshot.filter((food) => food.type === props.food.type));
    } else if (props.filterBy === 'fruitName') {
      setFoods(foodSnapshot.filter((food) => food.name === props.food.name));
    } else if (props.filterBy === 'reset') {
      setFoods([...foodSnapshot]);
    }
  };

  useEffect(() => {
    appendFoods();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.filterArea}>
        <FilterTool onSelect={handleFilterSelected}></FilterTool>
      </div>
      <div
        ref={wrapperRef}
        className={styles.scrollContainer}
        style={horizontalCenter('60vw')}
        onWheel={handleWheel}
      >
        <div className={styles.scrollBody}>
          {foods.map((food, idx) => {
            return (
              <FoodItem key={`${food.color}${idx}`} food={food}></FoodItem>
            );
          })}
        </div>
        <ScrollSpin active={spinActive} />
      </div>
    </div>
  );
};

export default App;

function fetchFoods(num: number): Promise<Food[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(foodFactory(num));
    }, 500);
  });
}

function foodFactory(num: number) {
  return new Array(num).fill(null).map(() => {
    return foods[_.random(8)];
  });
}
