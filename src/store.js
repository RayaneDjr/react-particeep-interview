import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { movies$ } from "./movies";

// fonction pour récupèrer les films
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
    sortMoviesByLikes: (state, action) => {
      const { order } = action.payload;
      state.movies = [...state.movies].sort((a, b) => {
        if (order === "asc") {
          return a.likes - b.likes;
        } else if (order === "desc") {
          return b.likes - a.likes;
        } else {
          return 0; // Aucun tri (pas nécessaire mais empêche d'enventuels bugs)
        }
      });
    },
    resetSorting: (state) => {
      // Réinitialise l'ordre des films par ID croissant
      state.movies = [...state.movies].sort((a, b) => a.id.localeCompare(b.id));
    },
  },
  // ajoute des reducers pour l'action asynchrone fetchMovies()
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Met à jour la liste des films avec les données récupérées
        state.movies = action.payload;
        // Met à jour la liste des catégories en extrayant les catégories uniques des films récupérés
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
  sortMoviesByLikes,
  resetSorting,
} = moviesSlice.actions;

export const store = configureStore({
  reducer: {
    movies: moviesSlice.reducer,
  },
});
