import React from 'react'
import * as Api from './api_module.js';

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

// React Component Container for the results list
// It has an interal state calculated from the currentSearchValue passed as props
const ResultsListContainer = React.createClass({
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
        <ResultsList results={ this.state.results } />
      </div>
    )
  }
})

// This is the presentational react component that renders the list
// there is no behavior in this one
const ResultsList = React.createClass({
  render () {
    return(
      <div>
        <h4>Results:</h4>
        <ul>
          { this.props.results.map( (movie) => {
              return <li key={ movie.numerical_id }>{ movie.title }</li>
            })
          }
        </ul>
      </div>
    )
  }
})

// React component that wraps the input and the results list components
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
        <ResultsListContainer currentSearchValue={ currentSearchValue }/>
      </div>
    )
  }
})
