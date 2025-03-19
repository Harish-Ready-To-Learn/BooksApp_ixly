import axios from 'axios';

const BASE_URL = 'https://openlibrary.org';

export const getBooksList = async (searchTerm = '', selectedCategory = '') => {
  try {
    const params = {};
    if (searchTerm) {
      params.q = searchTerm;
    }
    if (selectedCategory) {
      params.subject = selectedCategory;
    }

    const {data} = await axios.get(`${BASE_URL}/search.json`, {params});
    return data;
  } catch (error) {
    return error.response?.data || {error: 'Failed to fetch books list'};
  }
};
