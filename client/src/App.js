import React, { Component } from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import './App.css';
import userLocationURL from './media/user_bubble.svg';
import messageLocationURL from './media/message_bubble.svg';
import { getMessages, getLocation, sendMessage } from './API';
import MessageCard from './MessageCard';

var myIcon = L.icon({
  iconUrl: userLocationURL,
  iconSize: [50, 82],
  popupAnchor: [0, -41]
});

var messageIcon = L.icon({
  iconUrl: messageLocationURL,
  iconSize: [50, 82],
  popupAnchor: [0, -41]
});


class App extends Component {
  state = {
    location: {
      lat: 51.505,
      lng: -0.09,  
    },
    haveUsersLocation: false,
    zoom: 4,
    userMessage: {
      name: '',
      message: ''
    },
    sendingMessage: false,
    sentMessage: false,
    messages: []
  }

  componentDidMount() {

    getMessages()
      .then(messages => {
      this.setState({
        messages
      });
    });

    getLocation()
      .then(location => {
        this.setState({
          location,
          haveUsersLocation: true,
          zoom: 13
        }); 
      });
  }

  formIsValid = () => {
    let { name, message } = this.state.userMessage;
    name = name.trim();
    message = message.trim();
  
    const validMessage = 
      name.length > 0 && name.length <= 500 && message.length > 0  && message.length <= 500;

    return validMessage
      && this.state.haveUsersLocation ? true : false;
  }

  formSubmitted = (event) => {
    event.preventDefault();
     
    if(this.formIsValid()) {
      this.setState({
        sendingMessage: true
      });

      const message = {
        name: this.state.userMessage.name,
        message: this.state.userMessage.message,
        latitude: this.state.location.lat,
        longitude: this.state.location.lng
      };

      sendMessage(message)
        .then((result) => {
          setTimeout(() => {
            this.setState({
                sendingMessage: false,
                sentMessage: true
            });
            }, 2000);
        });
    }
  }

  valueChanged = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      userMessage: {
         ...prevState.userMessage,
         [name]: value
      }
    }))
  }

  render() {
    const position = [this.state.location.lat, this.state.location.lng]
    return (
      <div className="map">
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {
             this.state.haveUsersLocation ? 
            <Marker 
              position={position}
              icon={myIcon}>
            </Marker> : ''
          }

          {this.state.messages.map(message => (
              <Marker
                key={message._id} 
                position={[message.latitude, message.longitude]}
                icon={messageIcon}>
                <Popup>
                  <p><em>{message.name}:</em> {message.message}</p>
                  { 
                    message.otherMessages ? 
                    message.otherMessages.map(message => 
                    <p key={message._id}><em>{message.name}:</em> {message.message}</p>) : ''
                  }
                </Popup>
              </Marker>
            ))}

        </Map>
        <MessageCard
          sendingMessage={this.state.sendingMessage}
          sentMessage={this.state.sentMessage}
          haveUsersLocation={this.state.haveUsersLocation}
          formSubmitted={this.formSubmitted}
          valueChanged={this.valueChanged}
          formIsValid={this.formIsValid}
        />
      </div>
    );
  }
}

export default App;
