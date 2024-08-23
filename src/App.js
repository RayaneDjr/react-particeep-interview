import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import MovieList from "./MovieList";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <div className='title'>
          <p>
            <span style={{ color: "#00a8e8" }}>M</span>ovie{" "}
            <span style={{ color: "#00a8e8" }}>L</span>ist
          </p>
        </div>
        <MovieList />
      </div>
    </Provider>
  );
}

export default App;
