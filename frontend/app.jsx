'use strict';

import ReactDOM from 'react-dom';
import React from 'react'
import { Component, PropTypes } from 'react'
const request = require('./request');
import { combineReducers } from 'redux'
import { compose, createStore } from 'redux'
import { Provider } from 'react-redux'
import { connect } from 'react-redux'
// Redux DevTools store enhancers
import { devTools, persistState } from 'redux-devtools';
// React components for Redux DevTools
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

// This function return a literal object which is the action
// that the reducer will use
function addMovie(movie) {
  return {
    type: 'add_movie',
    movie: movie
  }
}

// Reducer, which is the responsible for handling the actions
// since we are using #combineReducers, the state that this
// reducer will receive is already under the movies key in the
// general state. That is why it starts by default to an empty array
function movies(state = [], action) {
  switch (action.type) {
    case 'add_movie':
      return [...state, action.movie]
    default:
      return state
  }
}

// Redux provides a utility to combine all the reducers in one single
// super reducer taht will be called for every action
//
// function movieApp(state = {}, action) {
//   return {
//     movies: movies(state.movies, action)
//   }
// }
// #createStore is completely equivalent to the code above
const movieApp = combineReducers({
  movies
})

// New createStore
const finalCreateStore = compose(
  // Enables your middleware:
  // applyMiddleware(m1, m2, m3), // any Redux middleware, e.g. redux-thunk
  // Provides support for DevTools:
  devTools(),
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

// Creating the store with the Super Big Reducer
const store = finalCreateStore(movieApp)

// Let's add a movie so that it can be seen the first time
// that the app loads
let firstMovie = {title: 'First movie', numerical_id: 1};
store.dispatch(addMovie(firstMovie));

// React component for the single movie
const MovieItem = React.createClass({
  render () {
    let { title } = this.props.movie
    return (
      <li>Title: { title }</li>
    )
  }
})

// React component for the whole list
const MoviesList = React.createClass({
  // When the component is about the mount calls this funciont
  // which makes the ajax request to get all the movies
  componentWillMount () {
    let url = 'https://gizmo.wuaki.tv/v3/movies?classification_id=1&user_status=visitor';
    request.get(url).then((response) => {
      // TODO: Create an action that takes an array of movies and updates the
      // state, rather than an actio per movie.
      // For now this is fun!
      response.data.forEach( (movie) => {
        // We use the function that is provided as props to add the movie
        // to the state.
        // This function is not the same as the addMovie function at the
        // beginning that creates the action
        this.props.addMovie(movie);
      });
    });
  },
  render () {
    let moviesComponents = this.props.movies.map((movie) => {
      // We pass the key and the movie as props to the child component
      return <MovieItem key={ movie.numerical_id } movie={ movie }/>
    });
    return(
      <div>
        <h2>List of movies:</h2>
        <ul>
          { moviesComponents }
        </ul>
      </div>
    );
  }
});

// This is the parent React Component that will get the state as props
// from the Provider
const App = React.createClass({
  // I thought that this was necessary, but apparently it works without it
  // propTypes = {
  //   movies: PropTypes.array.isRequired
  // },
  render() {
    // Injected by connect() call:
    const { dispatch, movies } = this.props
    return (
      <div>
        <MoviesList
          movies={ movies }
          addMovie={ movie =>
            dispatch(addMovie(movie))
          } />
      </div>
    )
  }
});

// In most cases you will only pass the first argument to connect(),
// which is a function we call a selector. This function takes the global
// Redux store’s state, and returns the props you need for the component.
// In the simplest case, you can just return the state given to you
// (i.e. pass identity function), but you may also wish to transform it first.
function select(state) {
  return state
}

// The ConnectedApp is the component that the connect returns
// this component will be connected to the store through the context
// the state will be in the props
// Any component wrapped with connect() call will receive a dispatch function
// as a prop, and any state it needs from the global state
let ConnectedApp = connect(select)(App)

class Root extends Component {
  render() {
    // This makes our store instance available to the components below.
    // (Internally, this is done via React’s “context” feature.)
    // Provider comes from the Redux Library
    return (
      <div>
        <Provider store={store}>
          <ConnectedApp />
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    );
  }
}

document.addEventListener("DOMContentLoaded", function () {
  ReactDOM.render(
    <Root />,
    document.getElementById('main')
  );
});
