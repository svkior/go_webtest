/**
 * Created by svkior on 18/08/15.
 * MAP VIew
 */

import React from 'react'
import Reflux from 'reflux'



var ObjRect = React.createClass({
    getDefaultProps(){
        return {
            size: 50,
            x: 50,
            y: 50

        }
    },
   render(){
       var size = this.props.size;
/*
       var pathData = [
           'M', 2, 2,
           'L', 62, 2,
           'L', 62, 62,
           'L', 2, 62,
           'L', 2, 2
       ].join(' ');
            <path d={pathData}/>
*/

/*
       pathData = [
           'M', 10, 150,
           'C', 200, 80, 350, 300, 450, 100
       ].join(' ');
       <path d={pathData} stroke="black" fill="none" strokeWidth={4}/>
*/

       return (
           <circle cx={this.props.x} cy={this.props.y} r={size} fill="red"/>
       );
   }
});


var BookPolyline = React.createClass({
    getDefaultProps(){
      return {
          x: 400,
          y: 100
      }
    },
    render(){

        var smX = this.props.x;
        var smY = this.props.y;

        var getXY= function(x, y){
            return [x+smX, y+smY].join(",");

        };

       var points = [
           getXY(200,60),
           getXY(240,230),
           getXY(310,230),
           getXY(350,60)
       ].join(" ");

       return (
           <polyline points={points} fill="lightcyan" fillOpacity="0.7" stroke="darkviolet"
               strokeWidth="25" strokeLinecap="round" strokeOpacity="0.2"/>
       )
   }
});


var BookClosedLine = React.createClass({
    getDefaultProps(){
        return {
            x: 200,
            y: 200
        }
    },
    render(){
        var smX = this.props.x;
        var smY = this.props.y;

        var getXY= function(x, y){
            return [x+smX, y+smY].join(",");

        };

        var points = [
            getXY(100, 50),
            getXY(115, 120),
            getXY(150, 150),
            getXY(115, 180),
            getXY(100, 250),
            getXY(85, 180),
            getXY(50, 150),
            getXY(85, 120)
        ].join(" ");
        return (
            <polygon points={points} fill="darkorange" fillOpacity="0.5" stroke="papayawhip"
                strokeWidth="20" strokeOpacity="0.7" strokeLinejoin="mitter"/>
        );
    }
});

var BookPath = React.createClass({
    render(){
        var path= [
            "M", "50", "50",
            "L", "150", "150"
        ].join(" ");
        return(
          <path stroke="black" d={path}/>
        );
    }
});

var BookPath2 = React.createClass({
    render(){
        var path = [
            "M", 150, 50,
            "L", 250, 150, 350, 100
        ].join(" ");

        return(
            <path stroke="black" d={path}/>
        );
    }
});

var BookPath3 = React.createClass({
    render(){
        var path=[
            "M", 70, 290,
            "L", 150, 150, 200, 250, 40, 250, 100, 150, 170, 290
        ].join(" ");

        return(
            <path d={path} transform="translate(300,0)"/>
        );
    }
});


var BookPath4 = React.createClass({
    render(){
        var path=[
            "M", 100, 350, 300, 100, 500, 350, "z",
            "M", 250, 320, 250, 220, 350, 220, 350, 320, "z"
        ].join(" ");

        return(
            <path d={path} fill="none" stroke="black" strokeWidth="20" />
        );
    }
});

var BookBezier1 = React.createClass({
    render(){
        var path=[
            "M", 100, 200,
            "Q", 200, 400, 300, 200,
        ].join(" ");
        var path2=[
            "M", 100, 200,
            "L", 200, 400, 300, 200
        ].join(" ");

        return(
            <g>
                <path d={path2} fill="none" stroke="red" strokeWidth="10" />
                <path d={path} fill="none" stroke="blue" strokeWidth="10" />
            </g>
        );
    }
});

var BookEye = React.createClass({
    render(){
        return(
            <g>
                <ellipse
                    cx="50" cy="50" rx="20" ry="14"
                    fill="#a1d9ad" fillOpacity="0.7" fillRule="nonzero" stroke="#32287d" strokeWidth="1" strokeOpacity="0.5"
                    />
                <g>
                    <circle fill="black" fillOpacity="1" fillRule="nonzero" stroke="#32287d" strokeWidth="1" strokeLinecap="butt"
                            strokeLinejoin="bevel" strokeMiterlimit="4" cx="50" cy="50" r="10"/>
                </g>
            </g>
        );
    }
});

var BookTxt1 = React.createClass({
    render(){
        return (
            <text x="20px" y="55px" fontFamily="Verdana" fontSize="43pt">
                Hello, World!
            </text>
        );
    }
});


var MapEditor = React.createClass({
    getDefaultProps(){
        return {
            sizeX: 1024,
            sizeY: 500
        }
    },
    render(){
        var sizeX = this.props.sizeX;
        var sizeY = this.props.sizeY;

        var viewBox = [
            0, 0, sizeX, sizeY
        ].join(' ');

        return (
           <svg viewBox={viewBox} width={sizeX} height={sizeY} fill="white">
               <defs>
                   <pattern id="Pattern01" width="10" height="10">
                       <rect width="10" heigth="10" fill="#FFFFFF" stroke="#000000" strokeWidth="0.1"/>
                   </pattern>
               </defs>
               <rect x="0" y="0" width="100%" height="100%" fill="url(#Pattern01)" strokeWidth="0.5" stroke="#000000"/>

               <ObjRect x={200} y={200}/>

               <line x2="300" y2="100" stroke="green" strokeWidth="10" strokeLinecap="round"/>

               <rect x="50" y="50" width="300" height="160" rx="90" ry="50" stroke="darkseagreen"  strokeWidth="10"
                     fill="lightgray" fillOpacity="0.6"/>

               <circle cx="150" cy="250" r="100" stroke="darkseagreen" strokeWidth="10" fill="grey"
                       fillOpacity="0.6"/>

               <ellipse cx="450" cy="55" rx="70" ry="35" stroke="darkseagreen" strokeWidth="8"
                        fill="lightgray" fillOpacity="0.6"/>

               <BookPolyline/>

               <BookClosedLine/>

               <BookPath/>
               <BookPath2/>
               <BookPath3/>
               <BookPath4/>

               <BookBezier1/>

               <BookEye/>

               <BookTxt1/>
           </svg>
        );
    }
});

export default MapEditor