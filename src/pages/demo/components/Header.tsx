import React,{Component} from 'react'
import {nanoid} from 'nanoid'
import {Input} from 'antd'
import { UserOutlined } from '@ant-design/icons';

export default class Header extends Component{


    handleKeyUp = (event)=>{

        const {keyCode,target} = event

        if(keyCode !== 13) return;
        if(target.value.trim() === ''){
            alert('输入不能为空')
            return
        }

        const newTodo = {name:target.value,done:false,id:nanoid(4)}

        this.props.addItem(newTodo)
        target.value = ''
    }

    render(){

        return (

            <Input onKeyUp={this.handleKeyUp} placeholder="请输入你的任务名称，按回车键确认" prefix={<UserOutlined />} defaultValue = '' />

        )
    }
}