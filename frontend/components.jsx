import React from 'react'
const request = require('./request');

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
    let url = 'https://gizmo.wuaki.tv/v3/movies?classification_id=1&user_status=visitor';
    request.get(url).then((response) => {
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

const ResultsList = React.createClass({
  getInitialState () {
    return { results: [] }
  },
  getResults (query) {
    let url = `https://gizmo.wuaki.tv/v3/movies?classification_id=1&query=${query}`;
    request.get(url).then((response) => {
      this.setState({ results: response.data });
    });
  },
  componentWillReceiveProps (newProps) {
    let query = newProps.currentSearchValue;
    if (query == '') {
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