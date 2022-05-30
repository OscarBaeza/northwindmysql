import React, { Component } from 'react';
import slide1 from './img/slide1.png';
import Slider from './hooks/Slide.js';
import datos from './Employees';


export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <div>
        <h1>NWIND</h1>
        
        
        <p>Bienvenidos a nuestro inventario</p>
        
        <img  className="w-40 lg:w-60" src={slide1}/>
      </div>
    );
  }
}
