import React, { Component } from "react";
import Header from './components/header';
import Content from './components/content';
import "./App.css";
import Footer from './components/footer';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Header title="NEORIS - Blockchain & IoT Demo" />
        <Content />
        <Footer />
      </div>
    );
  }
}

export default App;