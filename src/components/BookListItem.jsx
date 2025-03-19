import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {useDispatch} from 'react-redux';
import {selectBook} from '../store/redux/bookSlice';

const {width, height} = Dimensions.get('window'); // Get screen width

const BookListItem = ({item}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  console.log(item);

  return (
    <Pressable
      style={styles.bookItem}
      onPress={() => {
        dispatch(selectBook(item));
        navigation.navigate('BookDetailScreen');
      }}>
      {item.cover_i ? (
        <Image
          source={{
            uri: `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`,
          }}
          style={styles.bookImage}
        />
      ) : (
        <Image
          source={require('../assets/no-pictures.png')}
          style={styles.bookImage}
        />
      )}

      <View style={styles.overlay}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );
};

export default BookListItem;

const styles = StyleSheet.create({
  bookItem: {
    position: 'relative',
    marginBottom: 15,
    alignItems: 'center',
  },
  bookImage: {
    width: width,
    height: height * 0.6,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: width * 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 8,
  },
  bookTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 8,
  },
});
