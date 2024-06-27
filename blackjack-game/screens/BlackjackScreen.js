// BlackjackScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity, Animated, Easing } from 'react-native';
import { fetchNewDeck, drawCards } from '../api';
import Card from '../components/Card';

export default function BlackjackScreen() {
  const [deckId, setDeckId] = useState(null);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [scale, setScale] = useState(new Animated.Value(1));

  useEffect(() => {
    const initializeDeck = async () => {
      const newDeckId = await fetchNewDeck();
      setDeckId(newDeckId);
    };
    initializeDeck();
  }, []);

  const calculateScore = (cards) => {
    let score = 0;
    let aces = 0;

    cards.forEach(card => {
      if (['JACK', 'QUEEN', 'KING'].includes(card.value)) {
        score += 10;
      } else if (card.value === 'ACE') {
        aces += 1;
        score += 11;
      } else {
        score += parseInt(card.value);
      }
    });

    while (score > 21 && aces) {
      score -= 10;
      aces -= 1;
    }

    return score;
  };

  const startGame = async () => {
    if (!deckId) return;

    const initialPlayerCards = await drawCards(deckId, 2);
    const initialDealerCards = await drawCards(deckId, 2);

    setPlayerCards(initialPlayerCards);
    setDealerCards(initialDealerCards);
    setPlayerScore(calculateScore(initialPlayerCards));
    setDealerScore(calculateScore(initialDealerCards));
    setGameOver(false);
    setMessage('');
  };

  const hit = async () => {
    if (!gameOver) {
      const newCard = await drawCards(deckId, 1);
      const newPlayerCards = [...playerCards, ...newCard];
      const newPlayerScore = calculateScore(newPlayerCards);

      setPlayerCards(newPlayerCards);
      setPlayerScore(newPlayerScore);

      if (newPlayerScore > 21) {
        setGameOver(true);
        setMessage('You busted!');
      }
    }
  };

  const stand = async () => {
    if (!gameOver) {
      let newDealerCards = [...dealerCards];
      let newDealerScore = dealerScore;

      while (newDealerScore < 17) {
        const newCard = await drawCards(deckId, 1);
        newDealerCards = [...newDealerCards, ...newCard];
        newDealerScore = calculateScore(newDealerCards);
      }

      setDealerCards(newDealerCards);
      setDealerScore(newDealerScore);
      setGameOver(true);

      if (newDealerScore > 21 || playerScore > newDealerScore) {
        setMessage('You win!');
      } else if (playerScore < newDealerScore) {
        setMessage('Dealer wins!');
      } else {
        setMessage('It\'s a tie!');
      }
    }
  };

  const animateScale = (toValue) => {
    Animated.timing(scale, {
      toValue,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };

  return (
    <ImageBackground source={require('../assets/beautiful.webp')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Blackjack</Text>
        <View style={styles.cardsContainer}>
          <Text style={styles.subtitle}>Dealer's Cards:</Text>
          <FlatList
            data={dealerCards}
            renderItem={({ item }) => <Card card={item} />}
            keyExtractor={(item, index) => index.toString()}
            horizontal
          />
          <Text style={styles.score}>Score: {dealerScore}</Text>
        </View>
        <View style={styles.cardsContainer}>
          <Text style={styles.subtitle}>Player's Cards:</Text>
          <FlatList
            data={playerCards}
            renderItem={({ item }) => <Card card={item} />}
            keyExtractor={(item, index) => index.toString()}
            horizontal
          />
          <Text style={styles.score}>Score: {playerScore}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={hit}
            style={styles.button}
            onMouseEnter={() => animateScale(1.1)}
            onMouseLeave={() => animateScale(1)}
          >
            <Animated.Text style={[styles.buttonText, { transform: [{ scale }] }]}>HIT</Animated.Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={stand}
            style={styles.button}
            onMouseEnter={() => animateScale(1.1)}
            onMouseLeave={() => animateScale(1)}
          >
            <Animated.Text style={[styles.buttonText, { transform: [{ scale }] }]}>STAND</Animated.Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={startGame}
            style={styles.button}
            onMouseEnter={() => animateScale(1.1)}
            onMouseLeave={() => animateScale(1)}
          >
            <Animated.Text style={[styles.buttonText, { transform: [{ scale }] }]}>NEW GAME</Animated.Text>
          </TouchableOpacity>
        </View>
        {gameOver && <Text style={styles.message}>{message}</Text>}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', // Slightly darken the background for better readability
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  cardsContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  score: {
    fontSize: 36,
    marginTop: 10,
    color: '#fff',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 15,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#d9534f',
  },
});
