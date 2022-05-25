//import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";
import 'typeface-roboto';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { createTheme } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ExtendedSlider from './slider';
import background from "./AL_Hintergrund.png";
import background2 from "./Hintergrund_1.png";
import background3 from "./Hintergrund_2.png";

var rca = require("rainbow-colors-array");

const theme = createTheme();

//theme.spacing(2); // `${8 * 2}px` = '16px'

function component_toggle(props){

  return(
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography>{props.min}</Typography>
      <Switch defaultChecked />
      <Typography>{props.max}</Typography>
    </Stack>
  );
}


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prediction: '',
      features: [],
      rca: rca(25, "hex", true)
    }
  }

  FormSubmissionHandler( event ) {
    event.preventDefault();
    console.log(this.state);
    this.setState ({
      name: ''
    });
    const u = new URLSearchParams(this.state).toString();
    console.log(u);
    fetch('http://localhost:5000/?' + u)
        .then(response => response.json())
        .then(data => this.setState({ prediction: data.prediction }));
    fetch('http://localhost:5000/get_features')
        .then(response => response.json())
        .then(data => this.setState({ features: data.features }));
  }

  onChangeValue(feature){
    const u = new URLSearchParams(feature).toString();
    fetch('http://localhost:5000/?' + u)
        .then(response => response.json())
        .then(data => this.setState({ prediction: data.prediction }));
  }

  render () {
    let vertical_sliders = [];
    let horizontal_sliders = [];
    let toggles = [];

    let features = this.state.features;

    //console.log(this.state.rca);
    let props = {"callback": this.onChangeValue.bind(this)}
    
    for (let feature of features) {
      props["feature"] = feature;
      props["color"] = this.state.rca[features.indexOf(feature)];
      if (feature.type == "float64"){
        vertical_sliders.push(React.createElement(ExtendedSlider, props));
      }
      else if (feature.type == "int64" && feature.values.normalized == false){
        horizontal_sliders.push(React.createElement(ExtendedSlider, props));
      }
      else if (feature.type == "int64" && feature.values.normalized == true){
        toggles.push(component_toggle(props));
      }
    }
    
    return (
      <div className="App" style={{backgroundImage: "url(" + background + ")", backgroundSize: "cover"}}>
        <h1 style={{color: "black", paddingTop: "30px", paddingBottom: "0px", marginTop: "0px"}}>Spotify Stream Predictor</h1>
        <Grid container xs={{ flexGrow: 1 }} style={{padding: '30px', paddingTop: '10px', paddingBottom: '70px'}} spacing={4}>
          <Grid item xs={8} container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Acoustics
                  </Typography>
                  <Stack sx={{ height: '100%', mt: 2 }} spacing={1} direction="row" justifyContent="center">
                    {vertical_sliders}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card style={{backgroundImage: "url(" + background3 + ")", backgroundSize: "cover"}}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    General
                  </Typography>
                  {horizontal_sliders}
                </CardContent>
              </Card>
            </Grid>


          </Grid>
          <Grid item xs={4} container spacing={1}>
            <Card sx={{ width: '100%' }} style={{backgroundImage: "url(" + background2 + ")", backgroundSize: "cover"}}>
              <CardContent className={'center-center'}>
                <Typography>Estimated Streams:</Typography>
                <br></br>
                <h1>{this.state.prediction}</h1>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }

  componentDidMount(){
    this.setState ({
      name: ''
    });
    const u = new URLSearchParams(this.state).toString();
    console.log(u);
    fetch('http://localhost:5000/?' + u)
        .then(response => response.json())
        .then(data => this.setState({ prediction: data.prediction }));
    fetch('http://localhost:5000/get_features')
        .then(response => response.json())
        .then(data => this.setState({ features: data.features }));
    this.render();
  }
}
