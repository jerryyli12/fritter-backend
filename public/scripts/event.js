function viewAllEvents(fields) {
  fetch(`/api/events`)
    .then(showResponse)
    .catch(showResponse);
}

function createEvent(fields) {
  fetch(`/api/events`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function viewEvent(fields) {
  fetch(`/api/events/view/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}

function editEvent(fields) {
  fetch(`/api/events/view/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteEvent(fields) {
  fetch(`/api/events/view/${fields.id}`, {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function viewUserEvents(fields) {
  fetch(`/api/events/user`)
    .then(showResponse)
    .catch(showResponse);
}

function toggleAttendingEvent(fields) {
  fetch(`/api/events/user/attending/${fields.eventId}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function toggleInterestedEvent(fields) {
  fetch(`/api/events/user/interested/${fields.eventId}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
