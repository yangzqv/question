import Taro, { Component } from "@tarojs/taro";
import { View, Text, Input, Textarea, Button } from "@tarojs/components";
import Dialog from "./dialog";
import './addquestion.scss';

class AddQuestion extends Component {
  state = {
    title: '',
    desc: ''
  }

  changeTitle(event) {
    this.setState({
      title: event.target.value,
    })
  }

  changeDesc(event) {
    this.setState({
      desc: event.target.value
    })
  }

  onOk() {
    const { title, desc } = this.state;
    const id = Math.floor(Math.random() * 10);
    if (title && desc) {
      this.props.onReceiveQuestion && this.props.onReceiveQuestion({id, title, desc})
    } else {
      Taro.showToast({
        title: '请输入标题或者描述',
        icon: 'none'
      })
    }
  }

  render() {

    return (  
      <Dialog>
        <View className='add-question'>
          <View className='question-body'>
            <Input 
              className='question-title' 
              placeholder='请输入您的问题标题'
              focus 
              onInput={this.changeTitle.bind(this)}
            />
            <Textarea 
              className='question-desc' 
              placeholder='请输入您的问题描述' 
              onInput={this.changeDesc.bind(this)}
            />
            <View className='btn-group'>
              <Button 
                className='btn-question ok'
                onClick={this.onOk.bind(this)}
              >确定</Button>
              <Button 
                className='btn-question cancel'
                onClick={() => {this.props.onBtnCancel && this.props.onBtnCancel()}}
              >
                取消
              </Button>
            </View>
          </View>
        </View>
      </Dialog>
    );
  }
}

export default AddQuestion;
