import React, { Component } from "react";
import Header from './components/header';
import Content from './components/content';
import "./App.css";

class App extends Component {

  render() {
    return (
      <div className="App">
        <Header title="Demo Supply Chain Traking con Blockchain" />
        <Content />
      </div>
    );
  }
}

export default App;