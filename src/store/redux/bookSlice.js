// redux/bookSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  selectedBook: null,
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    selectBook: (state, action) => {
      state.selectedBook = action.payload;
    },
  },
});

export const {selectBook} = bookSlice.actions;
export default bookSlice.reducer;
