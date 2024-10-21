import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import {
    Input,
    Button,
    Card,
    Form,
    Select,
    Col,
    Row,
    DatePicker,
    Space,
    Divider,
    Timeline
} from 'antd';

import { MinusCircleFilled, MinusCircleOutlined, PlusCircleFilled, PlusCircleOutlined, PoweroffOutlined,  CheckCircleFilled, ClockCircleOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios'
import { connect } from 'umi';
import { nanoid } from 'nanoid'
import style from './style.css'
import { shape } from 'prop-types';


const { Option } = Select;

class RuleDefine extends Component {

    state = {
        ruleName:'',
        timeline: [{ c: 'green', f: '16px' }, { c: 'green', f: '16px' }, { c: 'green', f: '16px' }, { c: 'green', f: '16px' }],
        trigEvent: {
            id: nanoid(),
            eventId: '',
            props: [
                // {
                //     pid: nanoid,
                //     pname: 'p1',
                //     oper: '=',
                //     pvalue: 'v1'
                // }

            ]
        },
        tags: [
            // {
            //     id: nanoid(),
            //     startTime: '',
            //     endTime: '',
            //     tag: {
            //         tagName: '',
            //         tagOper: '',
            //         tagValue: ''
            //     }
            // }
        ],
        events: [
            // {
            //     id:nanoid,
            //     eventId: '',
            //     startTime: '',
            //     endTime: '',
            //     props: [
            //         {
            //             pid:nanoid,    
            //             pname: 'p1',
            //             oper: '=',
            //             pvalue: 'v1'
            //         },
            //         {
            //             pname: 'p2',
            //             oper: '>',
            //             pvalue: 'v2'
            //         }
            //     ],
            //     count: 3
            // }
        ],
        eventSeq: [
            // {
            //     id: nanoid,
            //     seqno: 1,
            //     eventId: '',
            //     startTime:'',
            //     endTime:'',
            //     props: [
            //         {
            //             pid: nanoid,
            //             pname: 'p1',
            //             oper: '=',
            //             pvalue: 'v1'
            //         }
            //     ]
            // }
        ]
    }


    /* 
     事件条件表单函数 
    */
    addEvent = () => {
        const { events } = this.state
        const newEvent = { id: nanoid(), props: [], count: 0 }
        const newEvents = [...events, newEvent]
        console.log(newEvents)
        this.setState({ events: newEvents })
    }

    // 删除事件条件
    deleteEvent = (eid) => {
        const { events } = this.state

        const newEvents = events.filter(e => e.id !== eid)

        this.setState({ events: newEvents })

    }

    // 删除属性条件
    deleteProperty = (pid) => {
        console.log("删除属性条件", pid)
        const { events } = this.state
        for (const e of events) {
            const props = e.props
            const newProps: any[] = []
            for (const p of props) {
                if (p.pid !== pid) {
                    newProps = [...newProps, p]
                }
            }
            e.props = newProps
        }

        this.setState({ events })
    }

    // 添加事件属性条件
    addProperty = (eid) => {
        const { events } = this.state
        const pobj = { pid: nanoid(), pname: '', oper: '', pvalue: '' }

        for (const e of events) {
            if (e.id === eid) {
                e.props = [...e.props, pobj]
            }
        }
        this.setState({ events: events })
    }


    setEventName = (eid) => {
        const { events } = this.state
        return (targeEvent) => {
            for (const e of events) {
                if (e.id === eid) {
                    console.log(targeEvent)
                    e.eventId = targeEvent
                }
            }

        }


    }

    setEventCount = (eid) => {
        const { events } = this.state
        return (targeEvent) => {
            for (const e of events) {
                if (e.id === eid) {
                    console.log(targeEvent.target.value)
                    e.count = targeEvent.target.value
                }
            }
        }
    }

    setProp = (eid, pid, ele) => {
        const { events } = this.state
        return (targeEvent) => {
            for (const e of events) {
                if (e.id === eid) {
                    for (const p of e.props) {
                        if (p.pid === pid) {
                            if (ele === 'pname') {
                                p.pname = targeEvent.target.value
                            } else if (ele === 'oper') {
                                p.oper = targeEvent
                            } else {
                                p.pvalue = targeEvent.target.value
                            }
                        }
                    }
                }
            }
            console.log(events)
        }
    }

    setDateRange = (eid) => {
        const { events } = this.state
        return (dates, dateStrings) => {
            for (const e of events) {
                if (e.id === eid) {
                    console.log(dateStrings)
                    e.startTime = dateStrings[0];
                    e.endTime = dateStrings[1];
                }
            }
            console.log(this.state)
        }
    }

    /* 
     画像条件表单函数 
    */
    setTag = (tid, ele) => {
        const { tags } = this.state
        return (targeEvent) => {
            for (const t of tags) {
                if (t.id === tid) {
                    if (ele === 'tagName') {
                        console.log('set name ', targeEvent)
                        t.tagName = targeEvent
                    } else if (ele === 'tagOper') {
                        console.log('set oper ', targeEvent)
                        t.tagOper = targeEvent
                    } else {
                        console.log('set value ', targeEvent.target.value)
                        t.tagValue = targeEvent.target.value
                    }
                }
            }

        }
    }


    deleteTag = (tid) => {
        const { tags } = this.state
        const newTags = tags.filter(t => t.id !== tid)
        this.setState({ tags: newTags })
    }


    // 添加画像标签条件
    addProfileTag = () => {
        console.log('添加标签.......')
        const { tags } = this.state
        console.log(tags)
        const tobj = {
            id: nanoid(),
            //startTime: '',
            //endTime: '',
            tagName: '',
            tagOper: '',
            tagValue: ''
        }

        const newTags = [...tags, tobj]

        this.setState({ tags: newTags })
    }


    /* 
     触发事件条件表单函数 
    */
    setTrigEventName = (targetEvent) => {
        const { trigEvent } = this.state
        trigEvent.eventId = targetEvent
    }

    setTrigDateRange = (dates, dateStrings) => {
        const { trigEvent } = this.state
        trigEvent.startTime = dateStrings[0];
        trigEvent.endTime = dateStrings[1];
        console.log(this.state)

    }

    addTrigProperty = () => {
        const { trigEvent } = this.state
        console.log('添加触发事件属性', trigEvent)
        const pobj = {
            pid: nanoid(),
            pname: '',
            oper: '',
            pvalue: ''
        }
        trigEvent.props = [...trigEvent.props, pobj]
        this.setState(trigEvent)
    }

    setTrigProp = (pid, ele) => {
        const { trigEvent } = this.state
        return (targeEvent) => {
            for (const p of trigEvent.props) {
                if (p.pid === pid) {
                    if (ele === 'name') {
                        p.pname = targeEvent.target.value
                    } else if (ele === 'oper') {
                        p.oper = targeEvent
                    } else {
                        p.pvalue = targeEvent.target.value
                    }
                }
            }

        }
    }

    deleteTrigProp = (pid) => {
        const { trigEvent } = this.state
        const newProps = trigEvent.props.filter(p => p.pid !== pid)
        trigEvent.props = newProps
        this.setState({ trigEvent })
    }

    /* 
     行为序列条件表单函数 
    */
    addSeqEvent = () => {
        const { eventSeq } = this.state
        const newEvent = { id: nanoid(), props: [] }
        const newSeq = [...eventSeq, newEvent]
        console.log(newSeq)
        this.setState({ eventSeq: newSeq })
    }

    // 删除事件条件
    deleteSeqEvent = (eid) => {
        const { eventSeq } = this.state

        const newEvents = eventSeq.filter(e => e.id !== eid)

        this.setState({ eventSeq: newEvents })

    }

    // 删除属性条件
    deleteSeqProperty = (eid, pid) => {
        console.log("删除属性条件", pid)
        const { eventSeq } = this.state
        for (const e of eventSeq) {
            if (e.id === eid) {
                const props = e.props
                const newProps = props.filter(p => p.pid !== pid)
                e.props = newProps
            }
        }

        this.setState({ eventSeq })
    }

    // 添加事件属性条件
    addSeqProperty = (eid) => {
        const { eventSeq } = this.state
        const pobj = { pid: nanoid(), pname: '', oper: '', pvalue: '' }

        for (const e of eventSeq) {
            if (e.id === eid) {
                e.props = [...e.props, pobj]
            }
        }
        this.setState({ eventSeq: eventSeq })
    }


    setSeqEventName = (eid) => {
        const { eventSeq } = this.state
        return (targetEvent) => {
            for (const e of eventSeq) {
                if (e.id === eid) {
                    e.eventId = targetEvent
                }
            }
        }
    }
    setSeqDateRange = (eid) => {
        const { eventSeq } = this.state
        return (dates, dateStrings) => {
            console.log(dateStrings)
            eventSeq.startTime = dateStrings[0];
            eventSeq.endTime = dateStrings[1];
        }
        console.log(this.state)

    }

    setSeqProp = (eid, pid, ele) => {
        const { eventSeq } = this.state
        return (targeEvent) => {
            for (const e of eventSeq) {
                if (e.id === eid) {
                    for (const p of e.props) {
                        if (p.pid === pid) {
                            if (ele === 'pname') {
                                p.pname = targeEvent.target.value
                            } else if (ele === 'oper') {
                                p.oper = targeEvent
                            } else {
                                p.pvalue = targeEvent.target.value
                            }
                        }
                    }
                }
            }
            console.log(eventSeq)
        }
    }


    timepoint = (i) => {
        const { timeline } = this.state
        const newTimeline = timeline.map((e, index) => {
            console.log(e, index)
            if (index === i) {
                e.c = 'red';
                e.f = '26px';
            } else {
                e.c = 'green';
                e.f = '16px'
            }
            return e
        })
        this.setState({ timeline: newTimeline })
    }

    setRuleName = (targetEvent)=>{
        console.log(targetEvent.target.value)
        this.setState({ruleName:targetEvent.target.value})
        
    }

    submit = () => {
        const st = this.state
        const {dispatch} = this.props
        console.log('--------------------')
        console.log(JSON.stringify(st))
        // application/json 方式提交
        axios.post('http://localhost:8080/api/publishrule', st)
        
        dispatch(routerRedux.push({
            pathname : 'ruledashboard'
        }))
        
    }

    render() {
        const { timeline, trigEvent, events, tags, eventSeq } = this.state


        return (
            <PageContainer content="营销推送规则定义">

                <Row align='stretch' justify='end' gutter={4} >
                    {/* <Col xl={4} lg={4} md={24} sm={24} xs={24}></Col> */}
                    <Col xl={4} lg={4} md={6} sm={24} xs={24} style={{ marginTop: '10px' }} >
                        <Card bordered>

                            <Timeline>
                                <Timeline.Item color="gray" >
                                    <br /> <Button type='primary' onClick={this.submit} icon={<PoweroffOutlined />} shape='round' > 开始定义 </Button>
                                    <br />
                                    <br />
                                    <br />
                                </Timeline.Item>
                                <Timeline.Item color={timeline[0].c} dot={<ClockCircleOutlined className="timeline-clock-icon" style={{ fontSize: timeline[0].f }} />} >
                                    <h3>触发事件条件定义</h3>
                                    事件名称
                                    <br />事件时段
                                    <br />事件属性
                                    <br />
                                    <br />
                                    <br />
                                </Timeline.Item>
                                <Timeline.Item color={timeline[1].c} dot={<ClockCircleOutlined className="timeline-clock-icon" style={{ fontSize: timeline[1].f }} />}>
                                    <h3>画像属性条件定义</h3>
                                    标签名称
                                    <br />比较逻辑
                                    <br />标签值
                                    <br />
                                    <br />
                                    <br />
                                </Timeline.Item>
                                <Timeline.Item color={timeline[2].c} dot={<ClockCircleOutlined className="timeline-clock-icon" style={{ fontSize: timeline[2].f }} />}>
                                    <h3>行为次数条件定义</h3>
                                    事件名称
                                    <br />事件时段
                                    <br />事件属性
                                    <br />行为次数
                                    <br />
                                    <br />
                                    <br />
                                </Timeline.Item>
                                <Timeline.Item color={timeline[3].c} dot={<ClockCircleOutlined className="timeline-clock-icon" style={{ fontSize: timeline[3].f }} />}>
                                    <h3>行为序列条件定义</h3>
                                    时间窗口
                                    <br />事件名称
                                    <br />事件属性
                                    <br /><br /><br />
                                    <br /><Button type='primary' onClick={this.submit} icon={<PoweroffOutlined />} shape='round' > 发布规则 </Button>
                                </Timeline.Item>
                                <Timeline.Item color="gray">

                                </Timeline.Item>
                            </Timeline>

                        </Card>
                    </Col>
                    <Col xl={18} lg={18} md={18} sm={24} xs={24}>
                    <Row>
                        <Col span={20}>
                        <Card bordered={true} style={{ marginTop: '10px' }} >
                                    <Form.Item label="策略名称：" >
                                    <Input placeholder="请输入自定义策略名称" onBlur={this.setRuleName} />
                                    </Form.Item>
                                </Card>
                        </Col>
                    </Row>
                        <Row justify='start' onClick={() => this.timepoint(0)}>
                            <Col span={20}>
                                {/* 触发事件卡 --------------------------------- */}
                                <Card bordered={true} style={{ marginTop: '10px' }} >
                                    <h1><CheckCircleFilled style={{ color: '#52C400' }} /> &nbsp; 触发事件定义</h1>
                                    <Divider>
                                    </Divider>

                                    <Form.Item label="事件名称：" >
                                        <Select style={{ width: 120 }} onChange={this.setTrigEventName}  >
                                            <Option value="pageView">pageView</Option>
                                            <Option value="adShow">adShow</Option>
                                            <Option value="addCart">addCart</Option>
                                            <Option value="adClick">adClick</Option>
                                            <Option value="fetchCoupon">fetchCoupon</Option>
                                            <Option value="submitOrder">submitOrder</Option>
                                            <Option value="thumbUp">thumbUp</Option>
                                            <Option value="addCollect">addCollect</Option>
                                            <Option value="shareProduct">shareProduct</Option>
                                            <Option value="shareContent">shareContent</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="起止时间：" >
                                        <DatePicker.RangePicker showTime={true} onChange={this.setTrigDateRange} />
                                    </Form.Item>

                                    <Form.Item>
                                        <a onClick={this.addTrigProperty}><PlusCircleFilled style={{ fontSize: '16px', color: 'orange', paddingRight: '4px' }} />事件属性</a>
                                    </Form.Item>
                                    <Space direction="vertical" style={{ marginTop: '5px' }}>
                                        {
                                            trigEvent.props.map(p => {
                                                return (
                                                    <Row key={p.pid}>
                                                        <Col style={{ marginLeft: '10px' }} >
                                                            <Form.Item label='属性名'>
                                                                <Input placeholder="属性名" defaultValue={p.pname} onBlur={this.setTrigProp(p.pid, 'name')} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col style={{ marginLeft: '10px' }} >
                                                            <Form.Item label='运算符'>
                                                                <Select style={{ width: 120 }} onChange={this.setTrigProp(p.pid, 'oper')}  >
                                                                    <Option value="eq">等于</Option>
                                                                    <Option value="lt">小于</Option>
                                                                    <Option value="gt">大于</Option>
                                                                    <Option value="lte">小于等于</Option>
                                                                    <Option value="gte">大于等于</Option>
                                                                    <Option value="contain">包含</Option>
                                                                    <Option value="in">在其中</Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col style={{ marginLeft: '10px' }} >
                                                            <Form.Item label='比较值'>
                                                                <Input placeholder="比较值" defaultValue={p.pvalue} onBlur={this.setTrigProp(p.pid, 'pvalue')} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col style={{ marginLeft: '10px' }} >
                                                            <a onClick={() => this.deleteTrigProp(p.pid)}><MinusCircleOutlined style={{ marginLeft: '10px', fontSize: '16px', color: '#FF4D4F', marginTop: '8px', paddingRight: '4px' }} /></a>
                                                        </Col>
                                                    </Row>
                                                )
                                            })
                                        }
                                    </Space>

                                    <br />

                                </Card>
                            </Col>
                        </Row>

                        <Row justify='start' onClick={() => this.timepoint(1)}>
                            <Col span={20}>
                                {/* 画像条件卡 --------------------------------- */}
                                <Card bordered={false} style={{ marginTop: '20px' }}>
                                    <span><h2>< CheckCircleFilled style={{ color: '#52C400' }} /> &nbsp; 画像标签规则定义</h2>
                                        <Button onClick={this.addProfileTag} icon={<PlusCircleOutlined />} type='ghost' size='small' shape='round' style={{ marginRight: '5px', marginLeft: '10px' }} > 画像标签 </Button>
                                    </span>
                                    <Divider>
                                    </Divider>
                                    {
                                        tags.map(t => {
                                            return (
                                                <Row key={t.id} style={{ marginTop: '10px' }}>
                                                    <Col style={{ marginLeft: '10px' }} >
                                                        <Form.Item label='标签名称'>
                                                            <Select style={{ width: 120 }} onChange={this.setTag(t.id, 'tagName')}  >
                                                                <Option value="cost_m">月消费额</Option>
                                                                <Option value="acc_cnt_m">月访问次数</Option>
                                                                <Option value="acc_time_m">月访问时长</Option>
                                                                <Option value="acc_top_pd_m">月访问最多频道</Option>
                                                                <Option value="acc_top_cat_m">月访问最多品类</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col style={{ marginLeft: '10px' }} >
                                                        <Form.Item label='运算符'>
                                                            <Select style={{ width: 120 }} onChange={this.setTag(t.id, 'tagOper')}  >
                                                                <Option value="eq">等于</Option>
                                                                <Option value="lt">小于</Option>
                                                                <Option value="gt">大于</Option>
                                                                <Option value="lte">小于等于</Option>
                                                                <Option value="gte">大于等于</Option>
                                                                <Option value="contain">包含</Option>
                                                                <Option value="in">在其中</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col style={{ marginLeft: '10px' }} >
                                                        <Form.Item label='标签值'>
                                                            <Input placeholder="标签值" onBlur={this.setTag(t.id, 'tagValue')} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col style={{ marginLeft: '10px' }} >
                                                        <a onClick={() => this.deleteTag(t.id)}>
                                                            <MinusCircleOutlined style={{ marginLeft: '10px', fontSize: '16px', color: '#FF4D4F', marginTop: '8px', paddingRight: '4px' }} />
                                                        </a>
                                                    </Col>
                                                </Row>
                                            )
                                        })
                                    }
                                </Card>
                            </Col>
                        </Row>

                        <Row justify='start' onClick={() => this.timepoint(2)}>
                            <Col span={20}>
                                {/* 行为条件卡 --------------------------------- */}
                                <Card bordered={false} style={{ marginTop: '20px' }} >
                                    <span><h2><CheckCircleFilled style={{ color: '#52C400' }} /> &nbsp; 行为次数规则定义</h2>
                                        <Button onClick={this.addEvent} icon={<PlusCircleOutlined />} type='ghost' size='small' shape='round' style={{ marginRight: '5px', marginLeft: '10px' }} > 行为事件 </Button>
                                    </span>
                                    <Divider>
                                    </Divider>
                                    {
                                        events.map(e => {
                                            const { id } = e
                                            return (
                                                <Card style={{ marginTop: '10px' }}>
                                                    <Row gutter={2} key={id}>
                                                        <Col span={6}>
                                                            <Form.Item label='事件名称'>
                                                                <Select style={{ width: 120 }} onChange={this.setEventName(id)}  >
                                                                    <Option value="pageView">pageView</Option>
                                                                    <Option value="adShow">adShow</Option>
                                                                    <Option value="addCart">addCart</Option>
                                                                    <Option value="adClick">adClick</Option>
                                                                    <Option value="fetchCoupon">fetchCoupon</Option>
                                                                    <Option value="submitOrder">submitOrder</Option>
                                                                    <Option value="thumbUp">thumbUp</Option>
                                                                    <Option value="addCollect">addCollect</Option>
                                                                    <Option value="shareProduct">shareProduct</Option>
                                                                    <Option value="shareContent">shareContent</Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={4}> <a onClick={() => this.deleteEvent(id)}><MinusCircleFilled style={{ marginLeft: '10px', fontSize: '16px', color: 'red', marginTop: '8px', paddingRight: '4px' }} />删除事件</a></Col>
                                                    </Row>
                                                    <Form.Item label="起止时间：" >
                                                        <DatePicker.RangePicker showTime={true} onChange={this.setDateRange(id)} />
                                                    </Form.Item>
                                                    <Form.Item label="发生次数：" >
                                                        <Row gutter={2}>
                                                            <Col span={4}>
                                                                <Input style={{ width: 80 }} defaultValue={e.count} onBlur={this.setEventCount(id)} />
                                                            </Col>
                                                        </Row>
                                                    </Form.Item>
                                                    <Form.Item>
                                                        <a onClick={() => this.addProperty(id)}><PlusCircleFilled style={{ fontSize: '16px', color: 'orange', paddingRight: '4px' }} />事件属性</a>
                                                    </Form.Item>
                                                    <Space direction="vertical" style={{ marginTop: '5px' }}>
                                                        {
                                                            e.props.map(p => {
                                                                return (
                                                                    <Row key={p.pid}>
                                                                        <Col style={{ marginLeft: '10px' }} >
                                                                            <Form.Item label='属性名'>
                                                                                <Input placeholder="属性名" defaultValue={p.pname} onBlur={this.setProp(id, p.pid, 'pname')} />
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col style={{ marginLeft: '10px' }} >
                                                                            <Form.Item label='运算符'>
                                                                                <Select style={{ width: 120 }} onChange={this.setProp(id, p.pid, 'oper')}  >
                                                                                    <Option value="eq">等于</Option>
                                                                                    <Option value="lt">小于</Option>
                                                                                    <Option value="gt">大于</Option>
                                                                                    <Option value="lte">小于等于</Option>
                                                                                    <Option value="gte">大于等于</Option>
                                                                                    <Option value="contain">包含</Option>
                                                                                    <Option value="in">在其中</Option>
                                                                                </Select>
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col style={{ marginLeft: '10px' }} >
                                                                            <Form.Item label='比较值'>
                                                                                <Input placeholder="比较值" defaultValue={p.pvalue} onBlur={this.setProp(id, p.pid, 'pvalue')} />
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col style={{ marginLeft: '10px' }} >
                                                                            <a onClick={() => this.deleteProperty(p.pid)}><MinusCircleOutlined style={{ marginLeft: '10px', fontSize: '16px', color: '#FF4D4F', marginTop: '8px', paddingRight: '4px' }} /></a>
                                                                        </Col>
                                                                    </Row>
                                                                )
                                                            })
                                                        }
                                                    </Space>
                                                    <br />
                                                </Card>
                                            )
                                        })
                                    }
                                </Card>
                            </Col>
                        </Row>

                        <Row justify='start' onClick={() => this.timepoint(3)}>
                            <Col span={20}>
                                <Card bordered={false} style={{ marginTop: '20px' }}>
                                    <span>
                                        <h2><CheckCircleFilled style={{ color: '#52C41A' }} /> &nbsp; 行为序列规则定义</h2>
                                        <Button onClick={this.addSeqEvent} icon={<PlusCircleOutlined />} type='ghost' size='small' shape='round' style={{ marginRight: '5px', marginLeft: '10px' }} >序列事件 </Button>
                                    </span>
                                    <Divider>
                                    </Divider>
                                    <Form.Item label="起止时间：" >
                                        <DatePicker.RangePicker showTime={true} onChange={this.setSeqDateRange} />
                                    </Form.Item>

                                    {
                                        eventSeq.map((e, index) => {
                                            const { id } = e
                                            return (
                                                <Card style={{ marginTop: '10px' }}>
                                                    <Row gutter={2} key={id}>
                                                        <Col span={4}>
                                                            <Form.Item label={'事件 (' + (index + 1) + ')'}>
                                                                <Select style={{ width: 120 }} onChange={this.setSeqEventName(id)}  >
                                                                    <Option value="pageView">pageView</Option>
                                                                    <Option value="adShow">adShow</Option>
                                                                    <Option value="addCart">addCart</Option>
                                                                    <Option value="adClick">adClick</Option>
                                                                    <Option value="fetchCoupon">fetchCoupon</Option>
                                                                    <Option value="submitOrder">submitOrder</Option>
                                                                    <Option value="thumbUp">thumbUp</Option>
                                                                    <Option value="addCollect">addCollect</Option>
                                                                    <Option value="shareProduct">shareProduct</Option>
                                                                    <Option value="shareContent">shareContent</Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={8}> <a onClick={() => this.deleteSeqEvent(id)}><MinusCircleFilled style={{ marginLeft: '10px', fontSize: '16px', color: 'red', marginTop: '8px', paddingRight: '4px' }} />删除事件</a></Col>
                                                    </Row>

                                                    <Form.Item>
                                                        <a onClick={() => this.addSeqProperty(id)}><PlusCircleFilled style={{ fontSize: '16px', color: 'orange', paddingRight: '4px' }} />事件属性</a>
                                                    </Form.Item>
                                                    <Space direction="vertical" style={{ marginTop: '5px' }}>
                                                        {
                                                            e.props.map((p) => {
                                                                return (
                                                                    <Row key={p.pid}>
                                                                        <Col style={{ marginLeft: '10px' }} >
                                                                            <Form.Item label='属性名'>
                                                                                <Input placeholder="属性名" defaultValue={p.pname} onBlur={this.setSeqProp(id, p.pid, 'pname')} />
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col style={{ marginLeft: '10px' }} >
                                                                            <Form.Item label='运算符'>
                                                                                <Select style={{ width: 120 }} onChange={this.setSeqProp(id, p.pid, 'oper')}  >
                                                                                    <Option value="eq">等于</Option>
                                                                                    <Option value="lt">小于</Option>
                                                                                    <Option value="gt">大于</Option>
                                                                                    <Option value="lte">小于等于</Option>
                                                                                    <Option value="gte">大于等于</Option>
                                                                                    <Option value="contain">包含</Option>
                                                                                    <Option value="in">在其中</Option>
                                                                                </Select>
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col style={{ marginLeft: '10px' }} >
                                                                            <Form.Item label='比较值'>
                                                                                <Input placeholder="比较值" defaultValue={p.pvalue} onBlur={this.setSeqProp(id, p.pid, 'pvalue')} />
                                                                            </Form.Item>
                                                                        </Col>
                                                                        <Col style={{ marginLeft: '10px' }} >
                                                                            <a onClick={() => this.deleteSeqProperty(e.id, p.pid)}><MinusCircleOutlined style={{ marginLeft: '10px', fontSize: '16px', color: '#FF4D4F', marginTop: '8px', paddingRight: '4px' }} /></a>
                                                                        </Col>
                                                                    </Row>
                                                                )
                                                            })
                                                        }
                                                    </Space>
                                                    <br />
                                                </Card>


                                            )

                                        })
                                    }
                                </Card>
                            </Col>
                        </Row>
                    </Col>

                </Row>
            </PageContainer>
        )
    }

}



export default connect(({ loading }: { loading: { effects: Record<string, boolean> } }) => ({
    submitting: loading.effects['rulemarketing/submitruledefine'],
}))(RuleDefine);