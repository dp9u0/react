# createElement

源码参考 [ReactElement](../packages/react/src/ReactElement.js)

关于API: `function createElement(type, config, children){}`，参数：

* type 代表创建的React Element 的类型，一般有：
  * 字符串 `div` `span` 等，表示对应原生Html Element 的类型，成为 HostElement
  * `class xxxx`，就是我们写的派生自 React.Component / React.PureElement类组件
  * 方法，如 `()=>{}`，函数组件
* config : 实际为 jsx 中的 props，不过 createElement 会对 config 做处理后创建 props
* children ：可变参数，传入 children

```js 
export function createElement(type, config, children) {
  // STEP: 1. config 参数校验 : ref / key; 通过 config 创建 props
  const props = {}; // 注意 这里会通过 RESERVED_PROPS 跳过 key ref __source __self
  // ... BLABLA   
  // STEP: 2. 处理 children
  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    // 如果只有一个 children 直接赋值给 props.children
    props.children = children;
  } else if (childrenLength > 1) {
    // 否则 创建 数组 复制给 props.children
    const childArray = Array(childrenLength);
  }
  // ... BLABLA 
  // STEP: 3. 默认参数
  // Resolve default props
  if (type && type.defaultProps) {
  // ... BLABLA 
  }
  // ...BLABLA
  // STEP: 4. dev 模式下的 displayname
  // ...BLABLA
  // STEP: 5. 返回 Element 实例
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}
```

返回的 ReactElement 结构如下：

```js
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };
```

