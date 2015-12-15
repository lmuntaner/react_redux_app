import React from 'react'
import * as Api from './api_module.js';

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
export const MoviesListContainer = React.createClass({
  // When the component is about the mount calls this funciont
  // which makes the ajax request to get all the movies
  componentWillMount () {
    Api.Movies.fetchAll().then((response) => {
      this.props.addMovieBatch(response.data);
    });
  },
  render () {
    let moviesComponents = this.props.movies.map((movie) => {
      // We pass the key and the movie as props to the child component
      return <MovieItem key={ movie.numerical_id } movie={ movie }/>
    });
    return(
      <div className='movie-list-container'>
        <MoviesList moviesComponents={ moviesComponents }/>
      </div>
    );
  }
});

const MoviesList = React.createClass({
  render () {
    return (
      <div>
        <h2>List of movies:</h2>
        <ul>
          { this.props.moviesComponents }
        </ul>
      </div>
    )
  }
});
