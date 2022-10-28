function viewUserLikedFreets(fields) {
  fetch(`/api/likes?user=${fields.user}`)
    .then(showResponse)
    .catch(showResponse);
}

function toggleLikeFreet(fields) {
  fetch(`/api/likes/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
