import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';

const CircularGraphic = () => {
  // Create circles with different properties and colors
  const createCircles = () => {
    const circles = [];
    const colors = [
      ['#6f7bf7', '#8f7bf7'],
      ['#f76f9a', '#f76fb7'],
      ['#6fb7f7', '#6f9af7'],
      ['#f7d36f', '#f7b76f'],
    ];
    
    for (let i = 0; i < 4; i++) {
      circles.push(
        <RadialGradient
          key={`gradient-${i}`}
          id={`gradient-${i}`}
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <Stop offset="0%" stopColor={colors[i][0]} stopOpacity="0.8" />
          <Stop offset="100%" stopColor={colors[i][1]} stopOpacity="0.3" />
        </RadialGradient>
      );
    }
    
    for (let i = 0; i < 4; i++) {
      circles.push(
        <Circle
          key={`circle-${i}`}
          cx="50%"
          cy="50%"
          r={30 + i * 20}
          fill={`url(#gradient-${i})`}
          fillOpacity={0.7 - i * 0.1}
          strokeWidth={i === 0 ? 2 : 1}
          stroke="rgba(255, 255, 255, 0.2)"
        />
      );
    }
    
    return circles;
  };

  return (
    <Animatable.View 
      animation="pulse" 
      iterationCount="infinite" 
      duration={3000}
    >
      <View style={styles.container}>
        <Svg width={200} height={200} viewBox="0 0 100 100">
          <Defs>
            {createCircles().slice(0, 4)}
          </Defs>
          {createCircles().slice(4)}
        </Svg>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CircularGraphic;
