import React, { useState, useReducer, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { DownOutlined } from '@ant-design/icons';
import TraceModal from '@/components/TraceModal';
import useMeasure from '@/hooks/useMeasure';
import foods, { Food } from '../foods';
import styles from './filter.less';

const fruits = foods.filter((food) => food.type === 'fruit');

interface FilterToolProps {
  onSelect: (action: { filterBy: string; food: Food }) => void;
}

export interface onSelectProps {
  filterBy: string;
  food: Food;
}

const App: React.FC<FilterToolProps> = ({ onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFoodType, setSelectedFoodType] = useState('');
  const [selectedFruitName, setSelectedFruitName] = useState('名称');
  const [modalButtonNode, modalButtonRef] = useMeasure<HTMLDivElement>();
  const [modalNode, modalRef] = useMeasure<HTMLDivElement>();

  const handleClickButton = (food: Partial<Food> & { modal?: boolean }) => {
    if (food.modal) {
      setModalVisible((prevState) => !prevState);
      setTimeout(() => {
        modalNode?.focus();
      }, 0);
      return;
    }
    if (food.type) {
      setSelectedFoodType((prevState) => {
        return prevState === food.type ? '' : food.type!;
      });
      setSelectedFruitName('名称');
      onSelect({
        filterBy: selectedFoodType === food.type ? 'reset' : 'foodType',
        food: food as Food,
      });
      return;
    }
  };

  const handleClickFruitItem = (food: Food) => {
    setSelectedFruitName(food.name);
    setSelectedFoodType('');
    onSelect({ filterBy: 'fruitName', food });
  };

  const handleModalBlur = () => {
    setModalVisible(false);
  };

  return (
    <div className={styles.buttonGroup}>
      <div
        data-cursor="pointer"
        role="button"
        className={classNames(styles.buttonItem, {
          [styles.selected]: selectedFoodType === 'fruit',
        })}
        onClick={() => handleClickButton({ type: 'fruit' })}
      >
        水果
      </div>
      <div
        data-cursor="pointer"
        className={classNames(styles.buttonItem, {
          [styles.selected]: selectedFoodType === 'other',
        })}
        onClick={() => handleClickButton({ type: 'other' })}
        role="button"
      >
        其他
      </div>
      <div
        data-cursor="pointer"
        role="button"
        tabIndex={0}
        ref={modalButtonRef}
        className={classNames(styles.buttonItem)}
        onMouseDown={() => handleClickButton({ modal: true })}
        style={{ color: selectedFruitName === '名称' ? '#fff' : '#eb4438' }}
      >
        {selectedFruitName}
        <DownOutlined
          className={classNames(styles.buttonArrow, {
            [styles.buttonArrowExpand]: modalVisible,
          })}
        />
      </div>
      <TraceModal visible={modalVisible} trigger={modalButtonNode}>
        <div
          tabIndex={0}
          className={styles.modalInner}
          onBlur={handleModalBlur}
          ref={modalRef}
        >
          {fruits.map((fruit, idx) => {
            return (
              <div
                className={classNames(styles.fruitItem, {
                  [styles.fruitItemSelected]: selectedFruitName === fruit.name,
                })}
                key={idx}
                onClick={() => handleClickFruitItem(fruit)}
                data-cursor="pointer"
              >
                {fruit.name}
              </div>
            );
          })}
        </div>
      </TraceModal>
    </div>
  );
};

export default App;
