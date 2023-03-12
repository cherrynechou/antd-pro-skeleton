import {
  Button,
  Input,
  Space,
  Modal,
  message,
  Tabs,
  Radio
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import React, { useState } from 'react';
import {
  directionIcons,
  suggestionIcons,
  editIcons,
  dataIcons,
  logoIcons,
  webIcons,
} from './iconData'
import Icon, { AppstoreOutlined } from '@ant-design/icons';
import * as icons from '@ant-design/icons';

export default (props: any) =>{
  const [ icon, setIcon ] = useState<string>('');
  const [ isModalOpen, setIsModalOpen ] = useState<any>(false);

  const handleOk = () =>{
    if(icon === ''){
      message.error('请选择一个图标！')
    }
    props.onChange(icon);
    setIsModalOpen(false);
  }

  const onCancel = () =>{
    setIcon('');
    setIsModalOpen(false);
  }

  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setIcon(value);
  };


  return (
    <>
      <div className='flex align-center'>
        <Input
          style={{ width:200 }}
          placeholder={ props.placeholder }
          value={ props.value }
          prefix={ props.value && <Icon component={icons[props.value]} /> }
        />
        <Button type="primary" onClick={()=>{setIsModalOpen(!isModalOpen)}}>
          <Space>
            <Icon component={ AppstoreOutlined  as React.ForwardRefExoticComponent<any>} />
          </Space>
        </Button>
      </div>

      <Modal
        destroyOnClose
        title='选择图标'
        open={isModalOpen}
        onCancel={() => onCancel()}
        onOk={handleOk}//提交图标关键字
        width={'60vw'}
      >
        <Tabs defaultActiveKey="1" >
          <Tabs.TabPane tab="方向性图标" key="1" >
            <Radio.Group>
              <Space direction={'horizontal'} wrap>
                {directionIcons.map((item,index)=>{
                  return (
                    <Radio.Button key={index} value={item} onChange={onChange}>
                      <Icon component={icons[item]} style={{fontSize: '16px'}} />
                    </Radio.Button>
                  )
                })}
              </Space>
            </Radio.Group>
          </Tabs.TabPane>

          <Tabs.TabPane tab="指示性图标" key="2" >
            <Radio.Group>
              <Space direction={'horizontal'} wrap>
                {suggestionIcons.map((item,index)=>{
                  return (
                    <Radio.Button key={index} value={item} onChange={onChange}>
                      <Icon component={icons[item]} style={{fontSize: '16px'}} />
                    </Radio.Button>
                  )
                })}
              </Space>
            </Radio.Group>
          </Tabs.TabPane>

          <Tabs.TabPane tab="编辑类图标" key="3" >
            <Radio.Group>
              <Space direction={'horizontal'} wrap>
                {editIcons.map((item,index)=>{
                  return (
                    <Radio.Button key={index} value={item} onChange={onChange}>
                      <Icon component={icons[item]} style={{fontSize: '16px'}} />
                    </Radio.Button>
                  )
                })}
              </Space>
            </Radio.Group>
          </Tabs.TabPane>

          <Tabs.TabPane tab="数据类图标" key="4" >
            <Radio.Group>
              <Space direction={'horizontal'} wrap>
                {dataIcons.map((item,index)=>{
                  return (
                    <Radio.Button key={index} value={item} onChange={onChange}>
                      <Icon component={icons[item]} style={{fontSize: '16px'}} />
                    </Radio.Button>
                  )
                })}
              </Space>
            </Radio.Group>
          </Tabs.TabPane>

          <Tabs.TabPane tab="网站通用图标" key="5" >
            <Radio.Group>
              <Space direction={'horizontal'} wrap>
                {webIcons.map((item,index)=>{
                  return (
                    <Radio.Button key={index} value={item} onChange={onChange}>
                      <Icon component={icons[item]} style={{fontSize: '16px'}} />
                    </Radio.Button>
                  )
                })}
              </Space>
            </Radio.Group>
          </Tabs.TabPane>

          <Tabs.TabPane tab="品牌和标识" key="6" >
            <Radio.Group>
              <Space direction={'horizontal'} wrap>
                {logoIcons.map((item,index)=>{
                  return (
                    <Radio.Button key={index} value={item} onChange={onChange}>
                      <Icon component={icons[item]} style={{fontSize: '16px'}} />
                    </Radio.Button>
                  )
                })}
              </Space>
            </Radio.Group>
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </>
  )
}
