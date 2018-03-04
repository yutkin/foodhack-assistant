/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NativeAppEventEmitter,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import SpeechToText from 'react-native-speech-to-text-ios';
import Tts from 'react-native-tts';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bg: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22,
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
  redButton: {
    width: 82,
    height: 82,
    backgroundColor: '#FF5145',
    borderRadius: 82,
    marginTop: 15,
    marginBottom: 15,
  },
  text: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },
  subtext: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
  },
});

const RECOGNITION_TIMEOUT = 1000; // 1.5 seconds
const POLLING_INTERVAL = 100;

Tts.setDefaultLanguage('ru-RU');

export default class InteractiveRecipe extends Component {
  static navigationOptions = {
    title: 'Interactive Mode',
  };

  constructor(props) {
    super(props);
    this.checkUserFinishedSpeaking = this.checkUserFinishedSpeaking.bind(this);
  }

  state = {
    isRecognizing: false,
    lastResult: null,
    lastResultAt: null,
    stepIndex: 0,
  }

  componentDidMount() {
    this.subscription = NativeAppEventEmitter.addListener(
      'SpeechToText',
      result => this.processRecognitionResult(result),
    );
    this.speak();
  }

  componentDidUpdate(prevProps, { stepIndex: prevStepIndex }) {
    const { stepIndex } = this.state;

    if (stepIndex !== prevStepIndex) {
      this.speak();
    }
  }

  componentWillUnmount() {
    if (!this.subscription) {
      return;
    }

    this.subscription.remove();
    this.subscription = null;
  }

  startRecognition() {
    SpeechToText.startRecognition('ru-RU');

    this.setState({ isRecognizing: true, lastResultAt: null });
    this.pollingTimerId = this.setInterval(this.checkUserFinishedSpeaking, POLLING_INTERVAL);
  }

  /**
   * Determines if user has finished speaking
   * and closes recognition session
   */
  checkUserFinishedSpeaking() {
    const { isRecognizing, lastResultAt } = this.state;
    const recognitionTimedOut = Date.now() - lastResultAt >= RECOGNITION_TIMEOUT;

    if (isRecognizing && lastResultAt !== null && recognitionTimedOut) {
      this.finishRecognition();
    }
  }

  finishRecognition() {
    this.clearInterval(this.pollingTimerId);
    this.pollingTimerId = null;

    SpeechToText.finishRecognition();
  }

  speak(customText) {
    const { stepIndex } = this.state;
    const { state: { params: { microsteps } } } = this.props.navigation;
    const step = microsteps[stepIndex] || null;

    let text = customText;
    if (!text) {
      if (step) {
        text = step.text; // eslint-disable-line
      } else {
        text = 'BEEP';
      }
    }

    return Tts.speak(text);
  }

  processIntent(intent) {
    const { stepIndex } = this.state;
    //     'repeat_step': ('повтори рецепт', 'давай заново', 'прочитай снова', 'начни заново',
    //     'повторим', 'еще раз', 'прочитай еще раз'),
    // 'step_next': ('дальше', 'я сделал', 'готово', 'давай дальше', 'следующий шаг',
    //   'закончили', 'шаг вперед'),
    // 'step_back': ('назад', 'вернемся', "давай вернемся назад", 'шаг назад'),
    // 'stop_cooking': ('стоп', "остановись", "перерыв", "давай остановимся",
    //      'перестань', 'хватит'),
    // 'unknown': None
    switch (intent) {
      case 'repeat_step':
        // use tts again to speak out the step
        this.speak();
        break;
      case 'step_next':
        // speak "следующий шаг: фыыаыва"
        this.setState({ stepIndex: stepIndex + 1 });
        break;
      case 'step_back':
        if (stepIndex === 0) {
          // use tts again to speak out the step
          this.speak();
          return;
        }

        this.setState({ stepIndex: stepIndex - 1 });
        break;
      case 'stop_cooking':
        this.setState({ stepIndex: 999 });
        break;
      case 'unknown':
      default:
        // speak "не совсем понимаю тебя"
        this.speak('Не совсем понимаю тебя');
        break;
    }
  }

  async requestIntent(text) {
    const queryText = encodeURIComponent(text.toLowerCase());
    const url = `https://import20k.today/api/get_text_intent/${queryText}`;

    try {
      const response = await global.fetch(url);
      const { intent } = await response.json();
      // this.setState({ intent });
      this.processIntent(intent);
    } catch (err) {
      alert('Couldn\'t fetch intent. Please refer to the logs for more info.');
      console.warn(JSON.stringify(err));
    }
  }

  processRecognitionResult({
    error,
    bestTranscription: { formattedString } = {},
    isFinal = false,
  }) {
    if (error) {
      console.warn('Couldn\'t recognize user\'s speech', JSON.stringify(error));
      global.alert('Unknown error occurred. Please refer to the logs to see more info.');
      return;
    }

    this.setState({
      isRecognizing: !isFinal,
      lastResult: formattedString,
      lastResultAt: Date.now(),
    });

    if (!isFinal) {
      return;
    }

    this.requestIntent(formattedString);
  }

  renderRecordButton() {
    const { isRecognizing } = this.state;
    const onPress = () => (
      isRecognizing
        ? this.finishRecognition()
        : this.startRecognition()
    );
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.redButton} />
      </TouchableOpacity>
    );
  }

  renderRecognizingView() {
    const { lastResult } = this.state;

    return (
      <View style={styles.inner}>
        <Text style={styles.text}>Говорите</Text>
        {this.renderRecordButton()}
        <Text style={styles.subtext}>{lastResult}</Text>
      </View>
    );
  }

  renderStepView() {
    const { stepIndex } = this.state;
    const { state: { params: { microsteps } } } = this.props.navigation;

    const step = microsteps[stepIndex] || null;
    return (
      <View style={styles.inner}>
        {!!step && [
          <Text style={styles.text}>{step.text}</Text>,
          this.renderRecordButton(),
          <Text style={styles.subtext}>
            Нажмите на кнопку или проведите рукой над камерой
            и скажите «Готово», когда закончите с этим шагом
          </Text>,
        ]}
      </View>
    );
  }

  render() {
    const { lastResult, isRecognizing, stepIndex } = this.state;
    const { state: { params: { microsteps } } } = this.props.navigation;

    const step = microsteps[stepIndex] || null;
    const allDone = step === null;

    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.bg}
          source={step.photo}
        >
          {
            isRecognizing
              ? this.renderRecognizingView()
              : this.renderStepView()
          }
        </ImageBackground>
      </View>
    );
  }
}

reactMixin(InteractiveRecipe.prototype, TimerMixin);
