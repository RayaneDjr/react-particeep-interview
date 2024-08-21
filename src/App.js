import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import MovieList from "./MovieList";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <h1>Movie List</h1>
        <MovieList />
      </div>
    </Provider>
  );
}

export default App;
