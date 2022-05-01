/*
  app.tsx

  Primay script for front-facing web application functionality.
*/

var React = require('react');
var ReactDOM = require('react-dom');

export class App extends React.Component {
  constructor(){
    super();
    this.state = {}
  }

  // Executed only once upon startup.
  componentDidMount(){
    // TODO.
  }

  render() {
    return (
      <div>
        Hello world!
      </div>
    )
  };
}

ReactDOM.render(<App />, document.getElementById('app'));