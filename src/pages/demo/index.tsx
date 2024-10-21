import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Input, Form, InputNumber, Radio, Select, Tooltip } from 'antd';
import type { Dispatch} from 'umi';
import { connect, FormattedMessage, formatMessage } from 'umi';
import type { FC } from 'react';
import React,{Component} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';
import Header from './components/Header'
import TodoList from './components/TodoList'
import Footer from './components/Footer'


class Demo extends Component {

    state = {todos:[
        {id:'001',name:'吃饭',done:true},
        {id:'002',name:'睡觉',done:false},
        {id:'003',name:'喝水',done:false},
        {id:'004',name:'打代码',done:true},

    ]}

    addItem = (todo)=>{

        const {todos } = this.state
        const newTodos = [todo,...todos]
        this.setState({todos:newTodos})

    }
    


    render() {
        const {todos} = this.state
        return (
            <>
            <Header addItem={this.addItem} />
            <br />
            <br />
            <TodoList todos={todos} />
            <br />
            <br />
            <Footer />
            </>

        )
    }
}


export default connect(({ loading }: { loading: { effects: Record<string, boolean> } }) => ({
    submitting: loading.effects['demo'],
}))(Demo);
