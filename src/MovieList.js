import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MovieCard from "./MovieCard";
import {
  fetchMovies,
  setFilter,
  setItemsPerPage,
  setCurrentPage,
  deleteMovie,
} from "./store";

const MovieList = () => {
  const dispatch = useDispatch();
  const { movies, filter, currentPage, itemsPerPage, categories, status } =
    useSelector((state) => state.movies);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMovies());
    }
  }, [status, dispatch]);

  const handleCheckboxChange = (category) => {
    if (category === "Tous") {
      dispatch(setFilter([])); // Clear the filter when "Tous" is checked
    } else {
      const newFilter = filter.includes(category)
        ? filter.filter((cat) => cat !== category) // Remove category if already in the filter
        : [...filter, category]; // Add category if not in the filter

      dispatch(setFilter(newFilter));
    }
  };

  const handleDeleteMovie = (movieId, movieCategory) => {
    dispatch(deleteMovie(movieId));

    // Check if the category is now empty
    const remainingMoviesInCategory = movies.filter(
      (movie) => movie.category === movieCategory && movie.id !== movieId
    );
    if (
      remainingMoviesInCategory.length === 0 &&
      filter.includes(movieCategory)
    ) {
      dispatch(setFilter([])); // Reset to "Tous" if category becomes empty
    }
  };

  const isAllChecked = filter.length === 0;
  const isCategoryChecked = (category) => filter.includes(category);

  const handleItemsPerPageChange = (e) => {
    dispatch(setItemsPerPage(Number(e.target.value)));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const filteredMovies = filter.length
    ? movies.filter((movie) => filter.includes(movie.category))
    : movies;

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  return (
    <div>
      <div className='filter'>
        <label>
          <input
            type='checkbox'
            value='Tous'
            checked={isAllChecked}
            onChange={() => handleCheckboxChange("Tous")}
          />
          Tous
        </label>
        {categories.map((category) => (
          <label key={category}>
            <input
              type='checkbox'
              value={category}
              checked={isCategoryChecked(category)}
              onChange={() => {
                if (isAllChecked) {
                  dispatch(setFilter([category])); // Start with only this category selected if "Tous" was previously checked
                } else {
                  handleCheckboxChange(category);
                }
              }}
            />
            {category}
          </label>
        ))}
      </div>

      {paginatedMovies.length === 0 && <p>No more movies :(</p>}
      <div className='movie-list'>
        {paginatedMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onDelete={() => handleDeleteMovie(movie.id, movie.category)}
          />
        ))}
      </div>

      <div className='pagination'>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </button>
        {(() => {
          const pages = [];
          for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
              pages.push(
                <button>
                  <strong>{i}</strong>
                </button>
              );
            } else {
              pages.push(
                <button onClick={() => handlePageChange(i)}>{i}</button>
              );
            }
          }
          return pages;
        })()}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </button>
      </div>

      <div className='items-per-page'>
        <label>Items per page: </label>
        <select
          onChange={(e) => {
            handleItemsPerPageChange(e);
            handlePageChange(1, e);
          }}
          value={itemsPerPage}>
          <option value='4'>4</option>
          <option value='8'>8</option>
          <option value='12'>12</option>
        </select>
      </div>
    </div>
  );
};

export default MovieList;
