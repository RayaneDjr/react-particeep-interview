import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { movies$ } from "./movies";

export const fetchMovies = createAsyncThunk("movies/fetchMovies", async () => {
  const response = await movies$;
  return response;
});

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    categories: [],
    filter: [],
    currentPage: 1,
    itemsPerPage: 4,
    status: "idle",
  },
  reducers: {
    deleteMovie: (state, action) => {
      state.movies = state.movies.filter(
        (movie) => movie.id !== action.payload
      );
      state.categories = [
        ...new Set(state.movies.map((movie) => movie.category)),
      ];
    },
    addLike: (state, action) => {
      const movie = state.movies.find((movie) => movie.id === action.payload);
      movie.likes++;
    },
    deleteLike: (state, action) => {
      const movie = state.movies.find((movie) => movie.id === action.payload);
      if (movie.likes > 0) {
        movie.likes--;
      }
    },
    addDislike: (state, action) => {
      const movie = state.movies.find((movie) => movie.id === action.payload);
      movie.dislikes++;
    },
    deleteDislike: (state, action) => {
      const movie = state.movies.find((movie) => movie.id === action.payload);
      if (movie.dislikes > 0) {
        movie.dislikes--;
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = action.payload;
        state.categories = [
          ...new Set(action.payload.map((movie) => movie.category)),
        ];
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const {
  deleteMovie,
  addLike,
  deleteLike,
  addDislike,
  deleteDislike,
  setFilter,
  setItemsPerPage,
  setCurrentPage,
} = moviesSlice.actions;

export const store = configureStore({
  reducer: {
    movies: moviesSlice.reducer,
  },
});
