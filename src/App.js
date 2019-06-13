import React from 'react';
import logo from './logo.svg';
import './App.css';

class BreakDisplay extends React.Component {
  render () {
    return (
      <div className="flex">
        <div>
          <p className="small-titles" id="break-label">Break Length</p>
          <div className="small-flex">
            <i id="break-decrement" className="fas fa-minus" onClick={this.props.removeclick}></i>
            <p id="break-length">{this.props.break}</p>
           <i id="break-increment" className="fas fa-plus" onClick={this.props.addclick}></i>
         </div>
        </div>
      </div>
    );
  }
}
class Start extends React.Component {
  render () {
    return (
      <div className="start-container">
        <i id="start_stop" onClick={this.props.click} className={`fas ${this.props.running ? "fa-pause" : "fa-play"}`}></i>
        <i id="reset" className="fas fa-redo" onClick={this.props.reset}></i>
      </div>
    )
  }
}
class SessionDisplay extends React.Component {
  render () {
    return (
      <div className="flex">
        <div>
         <p id="session-label" className="small-titles">Session Length</p>
         <div className="small-flex">
           <i id="session-decrement" className="fas fa-minus" onClick={this.props.removeclick}></i>
           <p id="session-length">{this.props.session}</p>
           <i id="session-increment" className="fas fa-plus" onClick={this.props.addclick}></i>
         </div>
        </div>
      </div>
    );
  }
}

class Timer extends React.Component {
  render () {
    const minutes = Math.floor(this.props.timer/60);
    const seconds = this.props.timer % 60;
    return (
      <div className="timer-container">
      <div className="timer-display">
        <div className={`arrow ${this.props.timer === this.props.session * 60 ? "" : this.props.running ? "arrow-play" : "arrow-pause"}`}></div>
        <h2 id="timer-label">{this.props.label}</h2>
        <div id="time-left">{minutes < 10 ? "0" + minutes: minutes}:{seconds < 10 ? "0" + seconds: seconds}</div>
        <Start running={this.props.running} click={this.props.click} reset={this.props.reset}/>
      </div>
      </div>
    );
  }
}  
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 5,
      session: 25,
      timer: 1500,
      cycle: "Session",
      running: false,
      intervalId: null,
      reset: true
    }
    this.handleSessionIncrement = this.handleSessionIncrement.bind(this);
    this.handleSessionDecrement = this.handleSessionDecrement.bind(this);
    this.handleBreakIncrement = this.handleBreakIncrement.bind(this);
    this.handleBreakDecrement = this.handleBreakDecrement.bind(this);
    this.handleTimer = this.handleTimer.bind(this);
    this.tick = this.tick.bind(this);
    this.reset = this.reset.bind(this);
  }
  reset() {
    clearInterval(this.state.intervalId);
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
    this.setState({
      break: 5,
      session: 25,
      timer: 1500,
      cycle: "Session",
      running: false,
      intervalId: null
    })
  }
  handleSessionIncrement() {
    if (this.state.timer < 3600) { this.setState(prevState => ({session: prevState.session + 1, timer: prevState.timer + 60}))
    }
  }
  handleSessionDecrement() {
    if(this.state.timer > 60) {this.setState(prevState => ({session: prevState.session - 1, timer: prevState.timer - 60}))
    }
  }
  handleBreakIncrement() {
    if(this.state.break < 60) {this.setState(prevState => ({break: prevState.break + 1}))
    }
  }
  handleBreakDecrement() {
    if(this.state.break > 1) {this.setState(prevState => ({break: prevState.break - 1}))
    }
  }
  tick() {
    if (this.state.timer > 0) {
      this.setState(prevState => ({timer: prevState.timer - 1}));
    }
    else if (this.state.cycle === "Session") {
      this.setState({cycle: "Break", timer: this.state.break * 60});
      const audio = document.getElementById("beep");
      audio.play();
      audio.currentTime = 0;
    }
    else {
      this.setState({cycle: "Session", timer: this.state.session *60})
      const audio = document.getElementById("beep");
      audio.play();
      audio.currentTime = 0;
    }
  }
  handleTimer() {
   if (!this.state.running) {
    this.setState(prevState => ({intervalId: setInterval(this.tick, 1000), running: !prevState.running}));
   }
    else {
      clearInterval(this.state.intervalId);
      this.setState(prevState => ({running: !prevState.running}));
    }
  }
  render () {
    return (
      <div className="container">
        <h1 className="title">Pomodoro Clock</h1>
        <BreakDisplay break={this.state.break} addclick={this.handleBreakIncrement} removeclick={this.handleBreakDecrement}/>     
        <SessionDisplay session={this.state.session} addclick={this.handleSessionIncrement} removeclick={this.handleSessionDecrement}/>
        <Timer timer={this.state.timer} label={this.state.cycle} running={this.state.running} click={this.handleTimer} reset={this.reset} session={this.state.session}/>
        <audio id="beep" preload="auto" 
          src="https://goo.gl/65cBl1" />
      </div>
    );
  }
}

export default App;
