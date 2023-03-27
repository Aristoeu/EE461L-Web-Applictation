import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Popup from './Popup';
import Button from '@mui/material/Button';
import { StyleSheet, View } from "react-native";
import TextField from '@mui/material/TextField';

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  center: {
    padding: 5, display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  center2: {
    padding: 15, display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: parseInt(this.props.num),
      content: '',
      showCheckPopup: false,
      checkMessage: '',
    };
    this.handleClickCheckOut = this.handleClickCheckOut.bind(this);
    this.handleClickCheckIn = this.handleClickCheckIn.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleClickCheckOut = async () => {
    try {
      const projectId = this.props.proname;
      const response = await fetch('http://localhost:5000/api/checkOut_hardware', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectid: projectId, qty: this.state.content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      this.setState({ checkMessage: data.qty + ' hardware checked out', showCheckPopup: true, num: (this.state.num + parseInt(this.state.content)) });

      setTimeout(() => {
        this.setState({ showCheckPopup: false });
      }, 3000);
    } catch (error) {
      console.error('Error checking out hardware:', error);
    }
  };

  handleClickCheckIn = async () => {
    try {
      const projectId = this.props.proname;
      const response = await fetch('http://localhost:5000/api/checkIn_hardware', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectid: projectId, qty: this.state.content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      this.setState({ checkMessage: data.qty + ' hardware checked in', showCheckPopup: true, num: (this.state.num - parseInt(this.state.content)) });

      setTimeout(() => {
        this.setState({ showCheckPopup: false });
      }, 3000);
    } catch (error) {
      console.error('Error checking in hardware:', error);
    }
  };

  handleInputChange(event) {
    this.setState({ content: event.target.value });
  }
  render() {
    return (
      <View style={[styles.container, {
        flexDirection: "row"
      }]}>
        <View style={styles.center}>
          <p className="my-paragraph" style={{ width: 150 }}>{this.props.hwsetName + this.state.num.toString() + "/100"}</p>
        </View>
        <View style={styles.center}>
          <TextField id="outlined-basic" label="Enter Qty" variant="outlined" onChange={this.handleInputChange} />
        </View>
        <View style={styles.center}>
          <Button variant="contained" onClick={this.handleClickCheckIn}>Check In</Button>
        </View>
        <View style={styles.center}>
          <Button variant="contained" onClick={this.handleClickCheckOut}>Check Out</Button>
        </View>
        {this.state.showCheckPopup && (
          <Popup onClose={() => this.setState({ showCheckPopup: false })}>
            {this.state.checkMessage}
          </Popup>
        )}
      </View>
    );
  }
}

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonText: this.props.buttonText,
      showPopup: false,
      popupMessage: ''
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = async () => {
    try {
      const projectId = this.props.proname;
      if (this.state.buttonText === "Join") {
        console.log("join");
        const response = await fetch('http://localhost:5000/api/joinProject', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ projectid: projectId }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        this.setState(prevState => ({ popupMessage: 'Joined ' + data.projectid, showPopup: true, buttonText: "Leave" }));
      } else {
        console.log("leave");
        const response = await fetch('http://localhost:5000/api/leaveProject', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ projectid: projectId }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        this.setState(prevState => ({ popupMessage: 'Left ' + data.projectid, showPopup: true, buttonText: "Join" }));
      }
      // Make the popup disappear after 1 second (1000 milliseconds)
      setTimeout(() => {
        this.setState({ showPopup: false });
      }, 3000);
    } catch (error) {
      console.error('Error joining project:', error);
    }
  };
  handleClosePopup = () => {
    this.setState({ showPopup: false });
  };
  render() {
    return (
      <View style={{
        flexDirection: "row",
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        padding: 5,
        width: 1130,
        backgroundColor: this.props.background,
      }}>
        <View style={styles.center2}>
          <p className="my-paragraph">{this.props.proname}</p>
        </View>
        <View style={styles.center2}>
          <p className="users">list, of, authorized, users</p>
        </View>
        <View style={styles.center}>
          <Buttons hwsetName='HWSet1: ' num={this.props.hwset1} proname={this.props.proname}/>
          <Buttons hwsetName='HWSet2: ' num={this.props.hwset2} proname={this.props.proname}/>
        </View>
        <View style={styles.center}>
          <Button variant="contained" style={{ width: 100 }}
            onClick={this.handleClick}>{this.state.buttonText}</Button>
        </View>
        {this.state.showPopup && (
          <Popup onClose={this.handleClosePopup}>
            {this.state.popupMessage}
          </Popup>
        )}
      </View>
    );
  }
}

class Projects extends React.Component {
  render() {
    return (
      <View style={{
        flexDirection: "column",
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        padding: 5,
        width: 1150,
      }}>
        <View >
          <h1 className="my-heading" style={{ padding: 10 }}>Projects</h1>
        </View>
        <View style={styles.center}>
          <Project proname="Project Name 1" hwset1='50' hwset2='0' buttonText='Join' background='white' />
        </View>
        <View style={styles.center}>
          <Project proname="Project Name 2" hwset1='50' hwset2='0' buttonText='Leave' background='#ccffcc' />
        </View>
        <View style={styles.center}>
          <Project proname="Project Name 3" hwset1='0' hwset2='0' buttonText='Join' background='white' />
        </View>
      </View>
    );
  }
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Projects />
  </React.StrictMode>
);
