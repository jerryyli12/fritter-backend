function viewControversialSetting(fields) {
  fetch(`/api/controversials`)
    .then(showResponse)
    .catch(showResponse);
}

function toggleControversialSetting(fields) {
  fetch(`/api/controversials`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function toggleControversialFreet(fields) {
  fetch(`/api/controversials/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
