import { Checkbox, Button } from 'antd';
import React, { Component } from 'react'


export default class Item extends Component {

    state = {mouse:false}

    handleMouse = (flag)=>{
        return ()=>{
            this.setState({mouse:flag})
        }
    }

    render() {
        const { id, name, done } = this.props

        return (
            <li style = {{backgroundColor:this.state.mouse?"#ddd" : "white"}}
            onMouseEnter = {this.handleMouse(true)} 
            onMouseLeave={this.handleMouse(false)}
            >
                <Checkbox 
                name="xxx" 
                defaultChecked={done} 

                />
                <span>{name}</span>
                <Button type="dashed" size="small" style={{display:this.state.mouse?'inline-block':'none'}}>删除</Button>
                <br />
            </li>
        )
    }
}
