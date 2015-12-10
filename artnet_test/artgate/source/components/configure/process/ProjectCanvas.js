/**
 * Created by svkior on 08.12.15.
 */

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import WireStore from '../../../stores/WireStore'
import {SVGComponent} from '../../svg/svg';

import Wire from './Wire'


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
                    return (<Wire key={key} wire={wires[key]} id={key}/>);
                })}
            </SVGComponent>
        );
    }
}

export default ProjectCanvas