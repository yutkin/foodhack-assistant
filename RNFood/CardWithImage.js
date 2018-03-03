import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';


const styles = {
  container: {
    width: '100%',
    height: 281,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 50,
  },
  bg: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 22,
  },
  innerBlend: {
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
  title: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
};

/* eslint-disable react/prefer-stateless-function */
export default class CardWithImage extends Component {
  static propTypes = {
    title: PropTypes.string,
    image: PropTypes.number.isRequired,
  }

  static defaultProps = {
    title: null,
  }

  render() {
    const { title, image } = this.props;

    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.bg}
          source={image}
        >
          <View
            style={Object.assign(
              {},
              styles.inner,
              title ? styles.innerBlend : {},
            )}
          >
            <Text style={styles.title}>{title}</Text>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
