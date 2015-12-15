// All the api interaction in one single place,
// not inside the react components

const request = require('./request');
const API_PATH = 'https://gizmo.wuaki.tv/v3';

let fetchMovies = () => {
  let url = `${API_PATH}/movies?classification_id=1&user_status=visitor`;
  return request.get(url);
}

let search = (query) => {
  let url = `${API_PATH}/movies?classification_id=1&query=${query}`;
  return request.get(url);
}

export let Movies = {
  fetchAll: fetchMovies,
  search
}
