import React, { Component } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Col, Divider, Card, Space } from 'antd';
import { UpCircleOutlined, IssuesCloseOutlined, SyncOutlined, PlayCircleOutlined, PauseCircleOutlined, StopOutlined } from '@ant-design/icons'
import axios from 'axios'


export default class RuleDashboard extends Component {

    constructor(props) {
        super(props)
        this.state = { ruleStatus: [] }
    }

    componentDidMount() {
        axios.post('http://localhost:8080/api/getrulestatus', JSON.stringify({ a: '1' }))
            .then(res => {
                console.log(res.data)
                this.setState({ ruleStatus: res.data })
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    dateFormat = (fmt, date) => {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }


    refreshStatus = (rid) => {
        const { ruleStatus } = this.state

        return () => {
            for (const r of ruleStatus) {
                setInterval(() => {
                    if (r.ruleId === rid && r.runStatus === '1') {
                        r.trigCount = parseInt(r.trigCount) + parseInt(Math.random() * 20)
                        r.hitCount = parseInt(r.hitCount) + parseInt(Math.random() * 20)
                        r.hitRatio = 33 + parseInt(Math.random() * 10) + '%'
                        r.compareGroupRatio = 15 + parseInt(Math.random() * 10) + '%'
                        r.ruleGroupRatio = 20 + parseInt(Math.random() * 10) + '%'
                        r.lastTrigTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
                        this.setState({ ruleStatus: ruleStatus })
                    }
                }, 1000)
            }
        }
    }

    controll = (st, rid) => {
        const { ruleStatus } = this.state
        return () => {
            for (const r of ruleStatus) {
                if (r.ruleId === rid) {
                    r.runStatus = st
                    this.setState(ruleStatus)
                }

            }
        }

    }


    // state = {
    //     ruleStatus: [
    //         {
    //             ruleId:'001',
    //             ruleName: '运营公众号拉新',
    //             ruleType: '触发型',
    //             publishTime: '2021-04-01 12:30:45',
    //             lastTrigTime: '2021-06-08 13:30:30',
    //             trigCount: 80,
    //             hitCount: 20,
    //             hitRatio: '30%',
    //             compareGroupRatio: '20%',
    //             ruleGroupRatio: '40%',
    //             runStatus:true
    //         }
    //     ]
    // }

    render() {
        const { ruleStatus } = this.state

        return (
            <PageContainer content='运营计划看板'>
                <Row justify="center" gutter={8}>
                    {
                        ruleStatus.map(r => {
                            return (
                                <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                                    <Card style={{ margin: '5px' }}>
                                        <Row gutter={1}>
                                            <Col span={16}>
                                                <h3><UpCircleOutlined style={{ marginRight: '4px' }} />{r.ruleName}</h3>
                                            </Col>
                                            <Col span={4}>
                                                <a style={{ color: 'white', backgroundColor: 'gray', borderRadius: '2px', paddingLeft: '2px', paddingRight: '2px' }}>{r.ruleType}</a>
                                            </Col>
                                            <Col span={2}>
                                                <a><SyncOutlined onClick={this.refreshStatus(r.ruleId)} /></a>
                                            </Col>
                                        </Row>
                                        <Divider orientation="left" plain >指标监控</Divider>
                                        <Row justify='center'>
                                            <Col span={22}>
                                                <Row style={{ marginTop: '2px' }}>
                                                    <Col span={4}>创建时间：</Col>
                                                    <Col span={20}>
                                                        {r.publishTime}
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '2px' }}>
                                                    <Col span={4}> 最近触发：</Col>
                                                    <Col span={20}>
                                                        {r.lastTrigTime}
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '2px' }} align='middle' justify='start'>
                                                    <Col span={4}>触发次数：</Col>
                                                    <Col span={8}>
                                                        <span style={{ color: '#111111', backgroundColor: '#eeeeee' }} >&nbsp;{r.trigCount}&nbsp;</span>
                                                    </Col>
                                                    <Col span={4}>完成次数：</Col>
                                                    <Col span={8}>
                                                        <span style={{ color: '#111111', backgroundColor: '#eeeeee' }} >&nbsp;{r.hitCount}&nbsp;</span>
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: '2px' }} align='middle' justify='start'>
                                                    <Col span={5}><Row justify='start' align='middle'><Col><div style={{ height: '28px' }}>目标完成率：</div></Col></Row></Col>
                                                    <Col span={19}>
                                                        <Row justify='start'>
                                                            <Col>
                                                                <h1 style={{ fontSize: '24px', color: '#eb5e28' }} >{r.hitRatio}</h1>
                                                            </Col>
                                                        </Row>
                                                    </Col>

                                                </Row>
                                                <Row style={{ marginTop: '8px' }} align='middle' justify='space-between'>
                                                    <Col span={24}><IssuesCloseOutlined /> &nbsp; 整体目标完成率：</Col>
                                                </Row>
                                                <Row style={{ marginTop: '2px' }} align='middle' justify='space-between'>
                                                    <Col span={12}>策略组：{r.ruleGroupRatio}</Col>
                                                    <Col span={12}>对照组：{r.compareGroupRatio}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Divider orientation="left" plain >operation functions </Divider>
                                        <Row justify='space-around' style={{ backgroundColor: '#fffffa', height: '32px', borderRadius: '4px' }} align='middle'>
                                            <Col><PlayCircleOutlined />
                                                <a style={{ color: r.runStatus==='1' ? 'gray' : 'green', marginLeft: '4px', height: '32px', pointerEvents: r.runStatus==='1' ? 'none' : 'auto' }} onClick={this.controll('1', r.ruleId)}>启用
                                            </a>
                                            </Col>
                                            <Col><PauseCircleOutlined /><a style={{ color: r.runStatus === '1' ? 'red' : 'gray', marginLeft: '4px', height: '32px', pointerEvents: r.runStatus==='1' ? 'auto' : 'none' }} onClick={this.controll('0', r.ruleId)}>停用</a></Col>
                                            <Col><StopOutlined /><a style={{ color: '#ea3546', marginLeft: '4px', height: '32px' }}>删除</a></Col>
                                        </Row>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </PageContainer>
        )
    }

}