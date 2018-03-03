/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  NativeAppEventEmitter,
} from 'react-native';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import SpeechToText from 'react-native-speech-to-text-ios';
import Tts from 'react-native-tts';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
    this.state = {
      isRecognizing: false,
      lastResult: null,
      lastResultAt: null,
    };
  }

  componentDidMount() {
    this.subscription = NativeAppEventEmitter.addListener(
      'SpeechToText',
      result => this.processRecognitionResult(result),
    );
  }

  componentWillUnmount() {
    if (!this.subscription) {
      return;
    }

    this.subscription.remove();
    this.subscription = null;
  }

  onStartRecognition() {
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
  }

  render() {
    const { lastResult, isRecognizing } = this.state;

    return (
      <View style={styles.container}>
        <Text>{isRecognizing ? 'recognizing' : 'not recognizing'}</Text>
        <Text>{lastResult}</Text>

        {!isRecognizing && (
          <Button
            onPress={() => this.onStartRecognition()}
            title="Start recognition"
            color="#841584"
          />
        )}

        <Button
          onPress={() => Tts.speak('Помой морковку, почисти и порежь ее кружочками')}
          title="Speak something"
          color="#841584"
        />
      </View>
    );
  }
}

reactMixin(InteractiveRecipe.prototype, TimerMixin);
