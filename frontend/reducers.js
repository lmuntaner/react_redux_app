// Reducer, which is the responsible for handling the actions
// since we are using #combineReducers, the state that this
// reducer will receive is already under the movies key in the
// general state. That is why it starts by default to an empty array
export let movies = (state = [], action) => {
  switch (action.type) {
    case 'add_movie':
      return [...state, action.movie];
    case 'add_movie_batch':
      return [...state, ...action.movies];
    default:
      return state;
  }
}

export let currentSearchValue = (state = '', action) => {
  switch (action.type) {
    case 'update_search_value':
      return action.searchValue;
    default:
      return state;
  }
}
