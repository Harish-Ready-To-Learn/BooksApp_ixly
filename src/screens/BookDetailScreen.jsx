import React from 'react';
import {View, Image, ScrollView, Linking} from 'react-native';
import {Text, Card, Button} from 'react-native-paper';
import {useSelector} from 'react-redux';
import ScreenWrapper from '../components/ScreenWrapper';

const BookDetailsScreen = () => {
  const book = useSelector(state => state.book.selectedBook);

  if (!book) {
    return (
      <View style={{padding: 16}}>
        <Text variant="headlineMedium">No book selected</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Card>
          <Card.Cover
            source={
              book.cover_i
                ? {
                    uri: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
                  }
                : require('../assets/no-pictures.png')
            }
            style={{height: 300}}
          />
          <Card.Content>
            <Text variant="headlineMedium" style={{marginVertical: 8}}>
              {book.title}
            </Text>
            <Text variant="bodyLarge">
              Author: {book.author_name?.join(', ')}
            </Text>
            <Text variant="bodyLarge">
              First Published: {book.first_publish_year}
            </Text>
            <Text variant="bodyLarge">Editions: {book.edition_count}</Text>
            <Text variant="bodyLarge">
              Languages: {book.language?.join(', ')}
            </Text>
          </Card.Content>
          {book.has_fulltext && book.lending_identifier_s && (
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => {
                  // Open the Internet Archive link for reading
                  const url = `https://archive.org/details/${book.lending_identifier_s}`;
                  Linking.openURL(url);
                }}>
                Read Online
              </Button>
            </Card.Actions>
          )}
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default BookDetailsScreen;
