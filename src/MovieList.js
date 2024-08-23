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
      dispatch(setFilter([])); // vide le filtre quand "Tous" est selectionné
      const newFilter = filter.includes(category)
        ? filter.filter((cat) => cat !== category) // supprime la catégorie si elle est déjà présente dans le filtre
        : [...filter, category]; // ajoute la catégorie si elle n'est pas présente dans le filtre

      dispatch(setFilter(newFilter));
    }
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    if (value === "none") {
      dispatch(resetSorting()); // enlève le tri par like
    } else {
      dispatch(sortMoviesByLikes({ order: value })); // tri par like
    }
  };

  const handleDeleteMovie = (movieId, movieCategory) => {
    dispatch(deleteMovie(movieId));

    // Vérifie si la catégorie est maintenant vide
    const remainingMoviesInCategory = movies.filter(
      (movie) => movie.category === movieCategory && movie.id !== movieId
    );
    if (
      remainingMoviesInCategory.length === 0 &&
      filter.includes(movieCategory)
    ) {
      dispatch(setFilter([])); // redirige l'utilisateur vers la catégorie "Tous" si la catégorie devient vide
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

  // filtre les films par catégorie
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
            checked={isAllChecked} // empêche la catégorie "Tous" d'être sélectionnée en même temps qu'une autre catégorie
            onChange={() => handleCheckboxChange("Tous")}
          />
          Tous
          <div className='control__indicator'></div>
        </label>

        {/* map dans catégorie pour un affichage dynamique */}
        {categories.map((category) => (
          <div className='checkbox-wrapper-21' key={category}>
            <label className='control control--checkbox'>
              <input
                type='checkbox'
                value={category}
                checked={isCategoryChecked(category)}
                onChange={() => {
                  if (isAllChecked) {
                    dispatch(setFilter([category])); // commence par une seule catégorie sélectionnée si "Tous" était précedemment sélectionné
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

      <div className='sort'>
        <label>
          <input
            className='radio'
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
            className='radio'
            type='radio'
            name='sortLikes'
            value='asc'
            onChange={handleSortChange}
          />
          Tri par nombre croissant de Likes
        </label>
        <label>
          <input
            className='radio'
            type='radio'
            name='sortLikes'
            value='desc'
            onChange={handleSortChange}
          />
          Tri par nombre décroissant de Likes
        </label>
      </div>

      <div className='movie-list'>
        {/* s'affiche si l'on supprime tous les films */}
        {paginatedMovies.length === 0 && <p>No more movies :(</p>}

        {/* affichage dynamique des films selon le filtre et tri par like */}
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
          {/* l'icone de navigation précédent ne s'affiche que si il existe encore des pages précédentes */}
          {currentPage > 1 && totalPages > 0 && (
            <NavigateBeforeIcon
              onClick={() => handlePageChange(currentPage - 1)}
              style={{ cursor: "pointer" }}
            />
          )}

          {/* affiche bouton page 1, 2, 3.. */}
          {(() => {
            const pages = [];
            for (let i = 1; i <= totalPages; i++) {
              if (i === currentPage) {
                pages.push(
                  // page actuelle de l'utilisateur
                  <button key={i}>
                    <strong style={{ color: "#00a8e8" }}>{i}</strong>
                  </button>
                );
              } else {
                pages.push(
                  // autres pages
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

          {/* l'icone de navigation suivant ne s'affiche que si il existe encore des pages suivantes */}
          {currentPage < totalPages && totalPages > 0 && (
            <NavigateNextIcon
              onClick={() => handlePageChange(currentPage + 1)}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>

        <div className='items-per-page'>
          <label>Items per page: </label>

          {/* change le nombre films affichés et redirige l'utilisateur vers la page
          1 pour éviter qu'il se retrouve sur une page inexistante (par exemple
          si l'utilisateur était sur la page 3 avec 4 films affichés et qu'il
          choisit d'afficher 12 films il se retrouvera sur la page 3 qui ne
          contient aucun puisque tous les films tiennent sur la page 1 --> on
          veut éviter cela */}
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
