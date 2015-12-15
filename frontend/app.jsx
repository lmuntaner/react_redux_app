'use strict';

import ReactDOM from 'react-dom';
import React from 'react'
import { Component, PropTypes } from 'react'
// const request = require('./request');
import { combineReducers } from 'redux'
import { compose, createStore } from 'redux'
import { Provider } from 'react-redux'
import { connect } from 'react-redux'
// Redux DevTools store enhancers
import { devTools, persistState } from 'redux-devtools';
// React components for Redux DevTools
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
// Actions
import { addMovie, addMovieBatch, updateSearchValue } from './actions.js'
// Reducers
import { movies, currentSearchValue } from './reducers'
// Components
import { MoviesList, LiveSearch } from './components'

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
  movies,
  currentSearchValue
})

// New createStore
// This is to use the dev tools that you cas see as a column at the right side
const finalCreateStore = compose(
  // Enables your middleware:
  // applyMiddleware(m1, m2, m3), // any Redux middleware, e.g. redux-thunk
  // Provides support for DevTools:
  devTools(),
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  // only for debugging purposes
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

// Creating the store with the Super Big Reducer
const store = finalCreateStore(movieApp)

// Let's add a movie so that it can be seen the first time
// that the app loads
let firstMovie = {title: 'First movie', numerical_id: 1};
store.dispatch(addMovie(firstMovie));

// This is the parent React Component that will get the state as props
// from the Provider
const App = React.createClass({
  // I thought that this was necessary, but apparently it works without it
  // propTypes = {
  //   movies: PropTypes.array.isRequired
  // },
  render() {
    // Injected by connect() call:
    const { dispatch, movies, currentSearchValue } = this.props
    return (
      <div>
        <MoviesList
          movies={ movies }
          addMovie={ movie =>
            dispatch(addMovie(movie))
          }
          addMovieBatch= { movies =>
            dispatch(addMovieBatch(movies))
          }/>
        <LiveSearch
          currentSearchValue={ currentSearchValue }
          updateSearchValue= { newValue =>
            dispatch(updateSearchValue(newValue))
          }/>
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

// class Root extends Component {
const Root = React.createClass({
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
})

document.addEventListener("DOMContentLoaded", function () {
  ReactDOM.render(
    <Root />,
    document.getElementById('main')
  );
});
