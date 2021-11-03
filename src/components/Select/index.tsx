// import React, { useState, useMemo, useEffect } from 'react';
// import useMeasure from '@/hooks/useMeasure';
// import classNames from 'classnames';
// import Dropdown from '@/components/TraceModal';
// import styles from './index.less';

// const MODE = {
//   MULTIPLE: 'multiple',
//   SINGLE: 'single',
// };
// const Select = ({
//   defaultValues,
//   onChange,
//   children,
//   className,
//   mode = MODE.MULTIPLE,
//   emptyText = '请选择',
//   max,
//   ...restProps
// }) => {
//   const [selectNode, selectNodeRef] = useMeasure();

//   const [selectedOptions, setSelectedOptions] = useState([]);

//   const [modalVisible, setModalVisible] = useState(false);

//   const placeholder = useMemo(() => {
//     if (selectedOptions.length === 0) {
//       return emptyText;
//     }
//     return selectedOptions.map((opt) => opt.label).join(',');
//   }, [selectedOptions]);

//   const isDisabled = useMemo(() => {
//     if (isNaN(max)) return false;
//     return selectedOptions.length >= max;
//   }, [selectedOptions, max]);

//   useEffect(() => {
//     onChange(selectedOptions);
//   }, [selectedOptions]);

//   useEffect(() => {
//     if (defaultValues) {
//       setSelectedOptions(defaultValues);
//     }
//   }, [defaultValues]);

//   const handleClick = () => {
//     setModalVisible(!modalVisible);
//   };

//   const handleBlur = () => {
//     setModalVisible(false);
//   };

//   return (
//     <div className={classNames(styles.select, className)} {...restProps}>
//       <div
//         className={classNames(styles.selectPlaceholder)}
//         ref={selectNodeRef}
//         onMouseDown={handleClick}
//       >
//         <span
//           className={classNames(styles.selectPlaceholderContent, {
//             [styles.selectPlaceholderContentDefault]:
//               selectedOptions.length === 0,
//           })}
//         >
//           {placeholder}
//         </span>
//         <span
//           className={classNames(styles.selectPlaceholderArrow, {
//             [styles.selectPlaceholderArrowExpand]: modalVisible,
//           })}
//         >
//           <DownOutlined />
//         </span>
//       </div>
//       <Dropdown visible={modalVisible} trigger={selectNode} onBlur={handleBlur}>
//         <div className={styles.selectDropdownWrapper}>
//           {React.Children.map(children, (child) =>
//             React.cloneElement(child, {
//               isDisabled,
//               selectedOptions,
//               setSelectedOptions,
//               closeModal: handleBlur,
//               mode,
//             }),
//           )}
//         </div>
//       </Dropdown>
//     </div>
//   );
// };

// const SelectOption = ({
//   value,
//   label,
//   isDisabled,
//   selectedOptions,
//   setSelectedOptions,
//   closeModal,
//   mode,
//   children,
// }) => {
//   const isSelected = useMemo(
//     () => selectedOptions.find((opt) => opt.value === value),
//     [selectedOptions, value],
//   );

//   const unClickable = !isSelected && isDisabled;

//   const handleClick = () => {
//     if (unClickable) {
//       return;
//     }
//     // 如果是单选，则点击后关闭modal
//     if (mode === MODE.SINGLE) {
//       setSelectedOptions(
//         isSelected
//           ? selectedOptions.filter((opt) => opt.value !== value)
//           : [
//               {
//                 label,
//                 value,
//               },
//             ],
//       );
//       closeModal();
//     } else {
//       setSelectedOptions(
//         isSelected
//           ? selectedOptions.filter((opt) => opt.value !== value)
//           : [
//               ...selectedOptions,
//               {
//                 label,
//                 value,
//               },
//             ],
//       );
//     }
//   };

//   return (
//     <div
//       className={classNames(styles.selectOption, {
//         [styles.selectOptionSelected]: isSelected,
//         [styles.selectOptionDisabled]: unClickable,
//       })}
//       onClick={handleClick}
//     >
//       {mode === MODE.MULTIPLE && (
//         <span className={styles.selectOptionCheckbox}>
//           {isSelected && <CheckOutlined />}
//         </span>
//       )}
//       <span className={styles.selectOptionLabel}>{children}</span>
//     </div>
//   );
// };

// export default Select;

// Select.Option = SelectOption;
