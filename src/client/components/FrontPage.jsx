import React, { Component } from "react";
import io from "socket.io-client";
import { Line as LineChart } from "react-chartjs-2";

class FrontPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      personId: "0",
      bpm: "0",
      moving: "0",
      time: "0",
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
    this.socket = io.connect("http://localhost:3000");
    this.socket.on("msgFromServer", msgFromMQTT => {
      let msg = JSON.parse(msgFromMQTT.toString());

      let timeArr = this.state.chartData.labels;
      let bpmArr = this.state.chartData.datasets[0].data;
      let movingArr = this.state.chartData.datasets[1].data;

      timeArr.push(this.state.time);
      bpmArr.push(this.state.bpm);
      movingArr.push(this.state.moving);

      this.setState({
        personId: msg.ID,
        time: msg.Time,
        bpm: msg.BPM,
        moving: msg.Moving,
        chartData: {
          labels: [...timeArr],
          datasets: [
            {
              label: "BPM",
              data: [...bpmArr],
              backgroundColor: "rgba(255,0,0,0.4)"
            },
            {
              label: "Movement",
              data: [...movingArr],
              backgroundColor: "rgba(50,50,250,0.4)"
            }
          ]
        }
      });
    });
  }

  render() {
    return (
      <div id="frontPageDiv">
        <h1 id="titleHeader">Status of the test-subject</h1>
        <br />
        <p>ID: {this.state.personId}</p>
        <p>Date: {this.state.date.toLocaleDateString()}</p>
        <p>Time: {this.state.time}</p>
        <p>BPM: {this.state.bpm}</p>
        <p>Distraction: {this.state.moving}</p>
        <LineChart data={this.state.chartData} width={600} height={250} />
      </div>
    );
  }
}

export default FrontPage;
