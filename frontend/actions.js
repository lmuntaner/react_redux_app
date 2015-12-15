// This function return a literal object which is the action
// that the reducer will use
export let addMovie = (movie) => {
  return {
    type: 'add_movie',
    movie: movie
  }
}

export let addMovieBatch = (movies) => {
  return {
    type: 'add_movie_batch',
    movies: movies
  }
}

export let updateSearchValue = (searchValue) => {
  return {
    type: 'update_search_value',
    searchValue: searchValue
  }
}
