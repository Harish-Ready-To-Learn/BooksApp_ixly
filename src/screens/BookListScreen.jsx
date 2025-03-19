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
import {getBooksList} from '../api/booksApi';
import {CATEGORIES} from '../utils/data';
import useDebounce from '../hooks/useDebounce';
import ScreenWrapper from '../components/ScreenWrapper';
import BookListItem from '../components/BookListItem';

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
        const data = await getBooksList('', selectedCategory);
        console.log(data);
        setBooks(data.docs || []);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    getBooks();
  }, [selectedCategory]);

  useEffect(() => {
    const getBooks = async () => {
      setLoading(true);
      try {
        const data = await getBooksList(debouncedSearchTerm, '');
        console.log(data);
        setBooks(data.docs || []);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    getBooks();
  }, [debouncedSearchTerm]);

  const handleCategorySelect = category => {
    setSelectedCategory(category);
    setSearchTerm('');
    setFilterVisible(false); // Close modal after selection
  };

  return (
    <ScreenWrapper>
      <View style={{flex: 1, paddingHorizontal: 20}}>
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
            keyExtractor={item => item.key}
            renderItem={({item}) => {
              return <BookListItem item={item} />;
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
    </ScreenWrapper>
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
    gap: 10,
    overflow: 'hidden',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
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
