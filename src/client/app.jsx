import React, { Component } from "react";
import FrontPage from "./components/FrontPage";
import DbCharts from "./components/DBcharts";

class App extends Component {
  render() {
    return (
      <div>
        <FrontPage />
        <br />
        <br />
        <br />
        <br />
        <br />
        <DbCharts id={"240019000b47363330353437"} />
      </div>
    );
  }
}

export default App;
