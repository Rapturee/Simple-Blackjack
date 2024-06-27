import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function Controls({ onHit, onStand, onNewGame }) {
  return (
    <View style={styles.controls}>
      <Button title="Hit" onPress={onHit} />
      <Button title="Stand" onPress={onStand} />
      <Button title="New Game" onPress={onNewGame} />
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});
