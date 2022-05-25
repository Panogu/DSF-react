import React, { Component } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default class ExtendedSlider extends Component {
    
    constructor(props) {
        super(props);

        let feature = props.feature;

        let or;
        let he;
        let wi;
        let ro = '';
        let maxval = 1;
        let minval = 0;
        if (feature.type == "float64"){
            or = "vertical";
            he = 200;
            wi = 13;
            ro = 'rotated';
        }
        else if (feature.type == "int64" && feature.values.normalized == false){
            or = "horizontal";
            he = 13;
        }

        if (feature.values.max > 1){
            maxval = feature.values.max;
        }
        if (feature.values.min < 1){
            minval = feature.values.min;
        }

        let st = Math.abs(feature.values.max - feature.values.min) / 250;
        if (feature.type == "int64" && st < 1){
            st = 1;
        }

        this.state = {
            name: feature.name,
            type: feature.type,
            value: (feature.values.max + feature.values.min) / 2,
            min: minval,
            max: maxval,
            orientation: or,
            step: st,
            callback: props.callback,
            inputting: false,
            input_timeout: 0,
            height: he,
            width: wi,
            rotated: ro,
            color: props.color.hex
        }
        this.input = React.createRef();
    }

  handleSliderChange (event, newValue) {
    this.setState({value: newValue});
    
    if (this.state.input_timeout) {
        clearTimeout(this.state.input_timeout);
    }
 
    this.setState({
        inputting: false,
        input_timeout: setTimeout(() => {
            this.state.callback({[this.state.name]: this.state.value});
        }, 200)
    });
  }

  handleInputChange (event) {
    this.setState({value: event.target.value === '' ? '' : Number(event.target.value)});
  }

  handleBlur (){
    if (this.state.value < this.state.min) {
        this.setState({value: this.state.min});
    } else if (this.state.value > this.state.max) {
        this.setState({value: this.state.max});
    }
  }

  render (){
      if (this.state.orientation == "vertical"){
        return(
            <div className={'flex-row'}>
                <div  style={{position: "relative"}}>
                <Input
                    value={this.state.value}
                    onChange={this.handleInputChange.bind(this)}
                    onBlur={this.handleBlur.bind(this)}
                    min={this.state.min}
                    max={this.state.max}
                    step={this.state.step}
                    inputProps={{
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                    }}
                />
                <div className={'rotated'}>
                    {this.state.name}
                </div>
                </div>
                <div>
                    <Slider
                        sx={{height: this.state.height, width: this.state.width}}
                        orientation={this.state.orientation}
                        value={this.state.value}
                        onChange={this.handleSliderChange.bind(this)}
                        aria-labelledby="input-slider"
                        ref={this.input}
                        min={this.state.min}
                        max={this.state.max}
                        step={this.state.step}
                    />
                </div>
            </div>
          )
      } else {
          return(
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                    {this.state.name}
                </Grid>
                <Grid item xs={7}>
                <Slider
                    sx={{width: this.state.width, height: this.state.height}}
                    orientation={this.state.orientation}
                    value={this.state.value}
                    onChange={this.handleSliderChange.bind(this)}
                    aria-labelledby="input-slider"
                    ref={this.input}
                    min={this.state.min}
                    max={this.state.max}
                    step={this.state.step}
                />
                </Grid>
                <Grid item={2}>
                <Input
                    value={this.state.value}
                    onChange={this.handleInputChange.bind(this)}
                    onBlur={this.handleBlur.bind(this)}
                    min={this.state.min}
                    max={this.state.max}
                    step={this.state.step}
                    inputProps={{
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                    }}
                />
                </Grid>
            </Grid>
          )
      }
      
    }
}