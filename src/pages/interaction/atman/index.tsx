import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import useMeasure from '@/hooks/useMeasure';
import TraceModal from '@/components/TraceModal';
import mans from './mans';
import styles from './style.less';

const App: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const modalTriggerRef = useRef<Range | undefined>();
  const editorRef = useRef<HTMLDivElement>(null);

  // 光标始终在文本最后
  const getFocus = (node: HTMLDivElement) => {
    node.focus();
    var range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(false);
    var selection = window.getSelection()!;
    //判断光标位置，如不需要可删除
    if (selection.anchorOffset != 0) {
      return;
    }
    selection.removeAllRanges();
    selection.addRange(range);
  };
  const handleDocumentClick = (e: MouseEvent) => {
    if ((e?.target as HTMLDivElement).classList?.contains(styles.popoverItem)) {
      e.preventDefault();
      const modalTriggerNode = modalTriggerRef.current;
      if (modalTriggerNode) {
        // 删除光标前的@字符
        const textNode = modalTriggerNode.startContainer;
        modalTriggerNode.setStart(textNode, modalTriggerNode.endOffset - 1);
        modalTriggerNode.setEnd(textNode, modalTriggerNode.endOffset);
        const c = modalTriggerNode.toString();
        if (c === '@') {
          modalTriggerNode.deleteContents();
        } else {
          modalTriggerNode.setStart(textNode, modalTriggerNode.endOffset);
        }
        // 把选中的人名加到editor中
        const name = (e?.target as HTMLDivElement).innerText;
        const $span = document.createElement('span');
        const $space = document.createTextNode('\u00A0');
        $span.innerText = `@${name}`;
        $span.setAttribute('contenteditable', 'false');
        modalTriggerNode.insertNode($space);
        modalTriggerNode.insertNode($span);
        getFocus(editorRef.current!);
      }
    }
    setModalVisible(false);
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    // 监听@键
    if (e.key === '@') {
      const selection = window.getSelection();
      const range = selection!.getRangeAt(0);
      // &#xFEFF;
      modalTriggerRef.current = range;
      setModalVisible(true);
    } else if (e.key !== '@' && e.key !== 'Shift') {
      modalTriggerRef.current = undefined;
      setModalVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    editorRef.current?.focus();
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.editorWrapper}>
        <h3>请输入@</h3>
        <div
          ref={editorRef}
          className={styles.editor}
          contentEditable
          onKeyUp={handleKeyUp}
        ></div>
        <TraceModal visible={modalVisible} trigger={modalTriggerRef.current!}>
          <div className={classNames(styles.popover, styles.highlight)}>
            {mans.map((man, idx) => {
              return (
                <div className={classNames(styles.popoverItem)} key={man.id}>
                  {man.name}
                </div>
              );
            })}
          </div>
        </TraceModal>
      </div>
    </div>
  );
};

export default App;
