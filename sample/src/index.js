import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

const onClick = () => { console.log('clicked') }

function C1 =(props) => {
  const { children } = props;
  React.Children.forEach(children, (child) => { child.onClick = onClick });
  return (
    <>
      {children}
    </>
  );
}

ReactDOM.render(<App title="App Test" />, document.getElementById('root'));
