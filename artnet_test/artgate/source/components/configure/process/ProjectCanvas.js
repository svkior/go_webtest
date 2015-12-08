/**
 * Created by svkior on 08.12.15.
 */

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import WireStore from '../../../stores/WireStore'

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

class ProjectCanvas extends Component {
    constructor(props){
        super(props);
        this.state = {
            wires: WireStore.getWires()
        };
        this.onWiresChange = this.onWiresChange.bind(this);
        WireStore.addChangeListener(this.onWiresChange);
    }

    componentWillUnmount(){
        WireStore.removeChangeListener(this.onWiresChange);
    }

    onWiresChange(){
        //console.log('OnWires Change', WireStore.getWires());
        this.setState({
            wires: WireStore.getWires()
        });
    }



    render(){
        const {wires} = this.state;
        // FIXME: Исправить ширину зоны прорисовки
        return (
            <SVGComponent height="600" width="800" style={{
            position:'absolute',
            borderStyle: '3px ridge orange',
            top: 0,
            left: 0
            }}

            >
                {Object.keys(wires).map(key => {
                    return <Line
                                key={key}
                                x1={wires[key].fromX}
                                y1={wires[key].fromY}
                                x2={wires[key].toX}
                                y2={wires[key].toY}
                                stroke="orange"
                                strokeWidth={3}
                    />;
                })}
            </SVGComponent>
        );
    }
}

export default ProjectCanvas