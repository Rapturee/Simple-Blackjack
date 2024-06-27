// Card.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function Card({ card }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: card.image }} style={styles.cardImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  cardImage: {
    width: 100,
    height: 150,
  },
});
