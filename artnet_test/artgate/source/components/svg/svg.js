/**
 * Created by svkior on 09.12.15.
 */
import React, {Component} from 'react'

class SVGComponent extends Component {
    render(){
        return <svg {...this.props}>{this.props.children}</svg>;
    }
}

class Line extends Component {
    render(){
        return <line {...this.props}>{this.props.children}</line>;
    }
}

class Path extends Component {
    render(){
        return <path {...this.props}>{this.props.children}</path>;
    }
}

module.exports = {
    SVGComponent:SVGComponent,
    Line: Line,
    Path: Path
};