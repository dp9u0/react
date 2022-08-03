function App() {
  return (<C1>
    <div key="1">Hello, React Source Code!</div>
    <div key="2">Hello, React Source Code!</div>
    <div key="3">Hello, React Source Code!</div>
    <div key="4">Hello, React Source Code!</div>
    <div key="5">Hello, React Source Code!</div>
    <div key="6">Hello, React Source Code!</div>
    <div key="7">Hello, React Source Code!</div>
  </C1>);
}

const onClick = () => { console.log("clicked") }

const C1 = (props) => {
  const { children } = props;
  React.Children.forEach(children, (child) => { console.log({ child }) });
  return (
    <div>
      {children}
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'))
