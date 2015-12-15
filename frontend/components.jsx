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
export const MoviesList = React.createClass({
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
        <h2>List of movies:</h2>
        <ul>
          { moviesComponents }
        </ul>
      </div>
    );
  }
});

// React Component for input box
const InputSearchField = React.createClass({
  updateSearchValue (e) {
    let newValue = e.target.value;
    this.props.updateSearchValue(newValue);
  },
  render () {
    return(
      <div>
        <input type='text'
               placeholder='Search...'
               value={ this.props.currentSearchValue }
               onChange={ this.updateSearchValue }/>
      </div>
    )
  }
});

// React Component for the results list
// It has an interla state calculated from the currentSearchValue passed as props
const ResultsList = React.createClass({
  getInitialState () {
    return { results: [] }
  },
  getResults (query) {
    Api.Movies.search(query).then((response) => {
      this.setState({ results: response.data });
    });
  },
  // This method is called everytime a new props is passed
  componentWillReceiveProps (newProps) {
    let query = newProps.currentSearchValue;
    if (query.length < 3) {
      this.setState({ results: [] });
    } else {
      this.getResults(query);
    }
  },
  render () {
    return(
      <div>
        <h4>Results:</h4>
        <ul>
          { this.state.results.map( (movie) => {
              return <li key={ movie.numerical_id }>{ movie.title }</li>
            })
          }
        </ul>
      </div>
    )
  }
})

export const LiveSearch = React.createClass({
  render () {
    let { currentSearchValue, updateSearchValue, newSearchResults } = this.props;
    return(
      <div className='live-search-container'>
        <h2>Live Search</h2>
        <InputSearchField
          currentSearchValue={ currentSearchValue }
          updateSearchValue={ updateSearchValue }
        />
        <ResultsList currentSearchValue={ currentSearchValue }/>
      </div>
    )
  }
})
