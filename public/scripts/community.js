function viewAllCommunities(fields) {
  fetch(`/api/communities`)
    .then(showResponse)
    .catch(showResponse);
}

function createCommunity(fields) {
  fetch(`/api/communities`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function viewCommunity(fields) {
  fetch(`/api/communities/view/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewUserCommunities(fields) {
  fetch(`/api/communities/user`)
    .then(showResponse)
    .catch(showResponse);
}

// function viewMembershipInCommunity(fields) {
//   fetch(`/api/communities/user/${fields.communityId}`)
//     .then(showResponse)
//     .catch(showResponse);
// }

function toggleMembershipInCommunity(fields) {
  fetch(`/api/communities/user/${fields.communityId}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
