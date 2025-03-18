import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {fetchBooks} from '../api/booksApi';
import {CATEGORIES} from '../utils/data';
import useDebounce from '../hooks/useDebounce';

const {width} = Dimensions.get('window'); // Get screen width

const BookListScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Technology');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  // Debounce the search term to prevent unnecessary API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const getBooks = async () => {
      setLoading(true);
      try {
        const data = await fetchBooks(debouncedSearchTerm, selectedCategory);
        setBooks(data.items || []);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    getBooks();
  }, [debouncedSearchTerm, selectedCategory]);

  const handleCategorySelect = category => {
    setSelectedCategory(category);
    setFilterVisible(false); // Close modal after selection
  };

  return (
    <View style={{flex: 1, padding: 20}}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search books..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={books}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            const {title, imageLinks} = item.volumeInfo;
            const imageUrl =
              imageLinks?.thumbnail || 'https://via.placeholder.com/400x600';

            return (
              <View style={styles.bookItem}>
                <Image source={{uri: imageUrl}} style={styles.bookImage} />
                <View style={styles.overlay}>
                  <Text style={styles.bookTitle} numberOfLines={2}>
                    {title}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
      {/* Filter Modal */}
      <Modal visible={filterVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.categoryValue}
                style={[
                  styles.categoryButton,
                  selectedCategory === cat.categoryValue &&
                    styles.selectedCategory,
                ]}
                onPress={() => handleCategorySelect(cat.categoryValue)}>
                <Text style={styles.categoryText}>{cat.categoryName}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFilterVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BookListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bookItem: {
    position: 'relative',
    marginBottom: 15,
  },
  bookImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
  },
  bookTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryButton: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#007bff',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#d9534f',
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
