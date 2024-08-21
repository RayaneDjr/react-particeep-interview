import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteMovie,
  addLike,
  deleteLike,
  addDislike,
  deleteDislike,
} from "./store";

const MovieCard = ({ movie }) => {
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);

  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteMovie(movie.id));
  };

  const handleToggleLike = () => {
    if (dislike) {
      dispatch(deleteDislike(movie.id));
      setDislike(!dislike);
    }

    if (!like) {
      dispatch(addLike(movie.id));
      setLike(!like);
    } else {
      dispatch(deleteLike(movie.id));
      setLike(!like);
    }
  };

  const handleToggleDislike = () => {
    if (like) {
      dispatch(deleteLike(movie.id));
      setLike(!like);
    }

    if (!dislike) {
      dispatch(addDislike(movie.id));
      setDislike(!dislike);
    } else {
      dispatch(deleteDislike(movie.id));
      setDislike(!dislike);
    }
  };

  return (
    <div className='movie-card'>
      <strong>{movie.title}</strong>
      <p>Category: {movie.category}</p>
      <div className='like-bar'>
        <div
          style={{
            width: `${(movie.likes / (movie.likes + movie.dislikes)) * 100}%`,
            backgroundColor: "green",
          }}>
          {movie.likes}
        </div>
        <div
          style={{
            width: `${
              (movie.dislikes / (movie.likes + movie.dislikes)) * 100
            }%`,
            backgroundColor: "red",
          }}>
          {movie.dislikes}
        </div>
      </div>
      <button onClick={handleToggleLike}>Toggle Like</button>
      <button onClick={handleToggleDislike}>Toggle Dislike</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default MovieCard;
