import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import './index.scss'

import AddQuestion from './addquestion.js';
import Yes from '../../images/yes.png';
import No from '../../images/no.png';

function getStore(key) {
  const str = Taro.getStorageSync(key);
  if (!str) {
    return []
  }
  
  return JSON.parse(key);
}

function setStore(key, obj) {
  let str = obj;
  if (typeof obj === 'object') {
    str = JSON.stringify(obj);
  }

  Taro.setStorageSync(key, str);
}

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  state = {
    showQuestionModal: false,
    questionList: getStore('questions')
  }

  addQuestion() {
    this.setState({
      showQuestionModal: true,
    })
  }

  receiveQuestion(options) {
    const { questionList } = this.state;
    questionList.push(options);
    this.setState({
      questionList,
    }, () => {
      setStore('questions', this.state.questionList);
      this.btnCancel();
    }) 
  }

  btnCancel() {
    this.setState({
      showQuestionModal: false,
    })
  }

  addVote(item) {
    const { questionList } = this.state;
    if (item) {
      item.vote = item.vote ? (item.vote + 1) : 1;
    }
  
    let newQuestionList = questionList.map((itemQuestion, index) => {
      if (itemQuestion.id === item.id) {
        itemQuestion = {...item};
      }
  
      return itemQuestion;
    })
    this.setState({questionList: newQuestionList}, () => {
      // 更新数据后，更新缓存
      setStore('questions', this.state.questionList)
    })
  }

  cutVote(item) {
    const { questionList } = this.state;
    if (item) {
      item.vote = item.vote ? ((item.vote - 1 >= 0) ? (item.vote - 1) : 0) : 0;
    }
  
    let newQuestionList = questionList.map((itemQuestion, index) => {
      if (itemQuestion.id === item.id) {
        itemQuestion = {...item};
      }
  
      return itemQuestion;
    })
    this.setState({questionList: newQuestionList}, () => {
      // 更新数据后，更新缓存
      setStore('questions', this.state.questionList)
    })
  }

  render () {
    const { showQuestionModal, questionList } = this.state;
    const myList = questionList.sort((a, b) => a.vote < b.vote);

    return (
      <View className='index'>
        <View className='title'>Taro问答实例</View>
        <View className='questions-list'>
          {myList.map((item, index) =>(
            <View key={index} className='questions'>
              <View className='question-left'>
                <View className='question-title'>{item.title}</View>
                <View className='question-desc'>{item.desc}</View>
              </View>
              <View className='question-right'>
                <Image 
                  src={Yes} 
                  className='img' 
                  onClick={this.addVote.bind(this, item)}
                />
                <Text>{item.vote ? item.vote : 0}</Text>
                <Image 
                  src={No} 
                  className='img' 
                  onClick={this.cutVote.bind(this, item)}  
                />              
              </View>
            </View>
          ))}
        </View>
        {showQuestionModal && (
          <AddQuestion 
            onBtnCancel={this.btnCancel.bind(this)} 
            onReceiveQuestion={this.receiveQuestion.bind(this)}
          />
          
        )}
        <Button
          className='btn-question'
          onClick={this.addQuestion.bind(this)}
        >
          提问
        </Button>
      </View>
    )
  }
}
