使用selection和Range对象。

在一个可编辑元素中，每次输入字符我都会打印当前光标的位置，但每次输入第一个字符所得到的信息都是 `DOMRect {x: 0, y: 0, width: 0, height: 0, top: 0, …}`，之后的位置信息都是正确的，这是为什么？将keydown改为keyup。

```js
$target.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key === '@') {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        console.log(range.getBoundingClientRect());
        // 异常 DOMRect {x: 0, y: 0, width: 0, height: 0, top: 0, …}
        const $span = document.createElement('span');
        $span.setAttribute('contenteditable', 'true');
        range.insertNode($span);
        console.log(range.getBoundingClientRect());
        // 正常
    }
})

```