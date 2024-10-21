import React, { Component } from 'react'
import Item from '../components/Item'
import {Space }  from 'antd'


export default class TodoList extends Component {
    render() {
        
        const { todos } = this.props
        return (
            <Space direction="vertical">
            {
                todos.map( todo =>{
                   
                    return <Item key={todo.id} {...todo} />
                })
            }
            </ Space >
        )
    }
}

