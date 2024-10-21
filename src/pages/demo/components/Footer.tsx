import { Checkbox, Space,Button } from 'antd';
import React, { Component } from 'react'


class Footer extends Component{

    render(){

        return (

            <>
            <Checkbox name="all" /> 已完成0/全部3件
            
            <Button type="primary"  >清除已完成任务</Button>
            </>
        );
    }
}

export default Footer;