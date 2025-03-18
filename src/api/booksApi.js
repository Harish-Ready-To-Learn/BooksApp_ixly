import axios from 'axios';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

// Function to fetch books based on search term and category
export const fetchBooks = async (
  searchTerm,
  selectedCategory,
  startIndex = 0,
  maxResults = 30,
) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        q: `${searchTerm}${
          selectedCategory ? `+subject:${selectedCategory}` : ''
        }`,
        startIndex,
        maxResults,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching books:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
