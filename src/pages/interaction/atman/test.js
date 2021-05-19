import './index.css';
const mans = [
  { id: 1, name: '阿赵' },
  { id: 2, name: '小白' },
  { id: 3, name: '王八蛋' },
  { id: 4, name: '陈二狗' },
  { id: 5, name: '李白' },
  { id: 6, name: '大大卷' },
];
const pageObj = Object.create(null);
const $editor = document.getElementById('editor');
const $popover = document.getElementById('popover');
// 删除光标前的@字符
const deleteAtCharBeforeCursor = () => {
  const range = pageObj.range;
  const textNode = range.startContainer;
  range.setStart(textNode, range.endOffset);
  range.setEnd(textNode, range.endOffset + 1);
  const c = range.toString();
  if (c === '@') {
    range.deleteContents();
  } else {
    range.setStart(textNode, range.endOffset);
  }
};

// 把选中的人名加到editor中
const appendAtMan = (name) => {
  deleteAtCharBeforeCursor();
  // 保证editor中的唯一性
  if ($editor.innerText.includes(`@${name}`)) return;
  const $span = document.createElement('span');
  const $space = document.createTextNode('\u00A0');
  $span.innerText = `@${name}`;
  $span.setAttribute('contenteditable', false);
  pageObj.range.insertNode($space);
  pageObj.range.insertNode($span);
  pageObj.selection.extend($space, 1);
  pageObj.selection.collapseToEnd(pageObj.range);
};

// 控制popover显示/隐藏
const popover = (shown) => {
  if (shown === 'show') {
    setPopoverPosition();
    $popover.style.opacity = 1;
    $popover.style.zIndex = 1;
  } else if (shown === 'hide') {
    $popover.style.opacity = 0;
    $popover.style.zIndex = -1;
  }
};

const setPopoverPosition = () => {
  const cursorPos = getCursorPosition();
  const popoverRect = $popover.getBoundingClientRect();
  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;
  let top = cursorPos.top + 20;
  let left = cursorPos.left + 10;
  // 防止popover底部溢出
  if (top + popoverRect.height > winHeight - 20) {
    top = winHeight - 20 - popoverRect.height;
  }
  // 防止popover右部溢出
  if (left + popoverRect.width > winWidth - 20) {
    left = winWidth - 20 - popoverRect.width;
  }
  $popover.style.top = `${top}px`;
  $popover.style.left = `${left}px`;
};

// 获取光标位置
const getCursorPosition = () => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  Object.assign(pageObj, { selection }, { range });
  const rect = range.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
  };
};

// 生成人员名单
const genPopoverFragment = (arr) => {
  const $fram = document.createDocumentFragment();
  arr.forEach((item) => {
    const $li = document.createElement('li');
    $li.appendChild(document.createTextNode(item.name));
    $li.setAttribute('class', 'popover-item');
    $fram.appendChild($li);
  });
  return $fram;
};
$popover.appendChild(genPopoverFragment(mans));
$editor.addEventListener('keydown', function (e) {
  // 监听@键
  if (e.shiftKey && e.key === 50) {
    popover('show');
  } else {
    popover('hide');
  }
});
document.addEventListener('click', function (e) {
  // 监听popover选项点击
  if (e.target.classList.contains('popover-item')) {
    // 把选中的人名加到editor中
    appendAtMan(e.target.innerText);
    popover('hide');
  }
});
