import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addLike, deleteLike, addDislike, deleteDislike } from "./store";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const MovieCard = ({ movie, onDelete }) => {
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);

  const dispatch = useDispatch();

  const handleDelete = () => {
    onDelete();
  };

  const handleToggleLike = () => {
    // Comportement du bouton like --> appuyer sur le bouton pour ajouter/supprimer like, si le film a été dislike supprime le dislike

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
    // Comportement du bouton dislike --> appuyer sur le bouton pour ajouter/supprimer dislike, si le film a été like supprime le dislike

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
            backgroundColor: "#00a8e8",
            transition: "all 0.5s",
          }}
        />
        <div
          style={{
            width: `${
              (movie.dislikes / (movie.likes + movie.dislikes)) * 100
            }%`,
            backgroundColor: "#e80033",
            transition: "all 0.5s",
          }}
        />
      </div>
      <div className='buttonsContainer'>
        <div style={{ display: "flex" }}>
          <div onClick={handleToggleLike} className='likes'>
            {like ? (
              <ThumbUpAltIcon
                style={{
                  color: "#00a8e8",
                  marginRight: "4px",
                }}
              />
            ) : (
              <ThumbUpOffAltIcon
                style={{
                  color: "#00a8e8",
                  marginRight: "4px",
                }}
              />
            )}
            {movie.likes}
          </div>
          <div onClick={handleToggleDislike} className='dislikes'>
            {dislike ? (
              <ThumbDownAltIcon
                style={{
                  color: "#e80033",
                  marginRight: "4px",
                }}
              />
            ) : (
              <ThumbDownOffAltIcon
                style={{
                  color: "#e80033",
                  marginRight: "4px",
                }}
              />
            )}
            {movie.dislikes}
          </div>
        </div>
        <div>
          <DeleteOutlineIcon
            onClick={handleDelete}
            style={{ color: "#e80033", cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
