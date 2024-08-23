import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MovieCard from "./MovieCard";
import {
  fetchMovies,
  setFilter,
  setItemsPerPage,
  setCurrentPage,
  deleteMovie,
  sortMoviesByLikes,
  resetSorting,
} from "./store";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

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

  const handleSortChange = (event) => {
    const value = event.target.value;
    if (value === "none") {
      dispatch(resetSorting());
    } else {
      dispatch(sortMoviesByLikes({ order: value }));
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

  let filteredMovies = filter.length
    ? movies.filter((movie) => filter.includes(movie.category))
    : movies;

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  return (
    <div>
      <div className='filter checkbox-wrapper-21'>
        <label className='control control--checkbox'>
          <input
            type='checkbox'
            value='Tous'
            checked={isAllChecked}
            onChange={() => handleCheckboxChange("Tous")}
          />
          Tous
          <div className='control__indicator'></div>
        </label>
        {categories.map((category) => (
          <div className='checkbox-wrapper-21' key={category}>
            <label className='control control--checkbox'>
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
              <div className='control__indicator'></div>
            </label>
          </div>
        ))}
      </div>

      <div>
        <label>
          <input
            type='radio'
            name='sortLikes'
            value='none'
            onChange={handleSortChange}
            defaultChecked
          />
          Aucun tri
        </label>
        <label>
          <input
            type='radio'
            name='sortLikes'
            value='asc'
            onChange={handleSortChange}
          />
          Tri par nombre croissant de Likes
        </label>
        <label>
          <input
            type='radio'
            name='sortLikes'
            value='desc'
            onChange={handleSortChange}
          />
          Tri par nombre décroissant de Likes
        </label>
      </div>

      <div className='movie-list'>
        {paginatedMovies.length === 0 && <p>No more movies :(</p>}
        {paginatedMovies.map((movie) => (
          <div key={movie.id}>
            <MovieCard
              movie={movie}
              onDelete={() => handleDeleteMovie(movie.id, movie.category)}
            />
          </div>
        ))}
      </div>

      <div className='bottom'>
        <div className='pagination'>
          {currentPage > 1 && totalPages > 0 && (
            <NavigateBeforeIcon
              onClick={() => handlePageChange(currentPage - 1)}
              style={{ cursor: "pointer" }}
            />
          )}
          {(() => {
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
              if (i === currentPage) {
                pages.push(
                  <button key={i}>
                    <strong style={{ color: "#00a8e8" }}>{i}</strong>
                  </button>
                );
              } else {
                pages.push(
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    style={{ cursor: "pointer" }}>
                    {i}
                  </button>
                );
              }
            }
            return pages;
          })()}
          {currentPage < totalPages && totalPages > 0 && (
            <NavigateNextIcon
              onClick={() => handlePageChange(currentPage + 1)}
              style={{ cursor: "pointer" }}
            />
          )}
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
    </div>
  );
};

export default MovieList;
