export function fetchData(url) {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error('Oooops!');
    }
    return response.json();
  });
}
