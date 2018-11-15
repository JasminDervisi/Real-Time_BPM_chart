import React, { Component } from "react";
import axios from "axios";
import { Line as LineChart } from "react-chartjs-2";

class DBCharts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      chartData: {
        labels: [],
        datasets: [
          {
            label: "BPM",
            data: [],
            backgroundColor: "rgba(255,0,0,0.4)"
          },
          {
            label: "Movement",
            data: [],
            backgroundColor: "rgba(50,50,250,0.4)"
          }
        ]
      }
    };
  }

  componentDidMount() {
    console.log("inne");
    let url = location.origin + "/api/v1/user";
    axios.get(url).then(res => {
      let time = [];
      let bpm = [];
      let moving = [];

      res.data.map(x => {
        if (x.ID === this.state.id) {
          time.push(x.Time);
          bpm.push(x.BPM);
          moving.push(x.Moving);
        }
      });

      this.setState({
        chartData: {
          labels: time,
          datasets: [
            {
              label: "BPM",
              data: bpm,
              backgroundColor: "rgba(255,0,0,0.4)"
            },
            {
              label: "Movement",
              data: moving,
              backgroundColor: "rgba(50,50,250,0.4)"
            }
          ]
        }
      });
    });
  }

  render() {
    return (
      <div id="dbChartDiv">
        <h1 id="titleHeader">Stats of test-subject id: {this.state.id}</h1>
        <br />
        <LineChart data={this.state.chartData} width={600} height={250} />
      </div>
    );
  }
}

export default DBCharts;
