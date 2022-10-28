// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-user': viewUser,
  'view-controversial-setting': viewControversialSetting,
  'toggle-controversial-setting': toggleControversialSetting,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'toggle-like-freet': toggleLikeFreet,
  'view-user-liked-freets': viewUserLikedFreets,
  'toggle-controversial-freet': toggleControversialFreet,
  'view-all-communities': viewAllCommunities,
  'create-community': createCommunity,
  'view-community': viewCommunity,
  'view-user-communities': viewUserCommunities,
  // 'view-membership-in-community': viewMembershipInCommunity,
  'toggle-membership-in-community': toggleMembershipInCommunity,
  'view-all-events': viewAllEvents,
  'create-event': createEvent,
  'view-event': viewEvent,
  'edit-event': editEvent,
  'delete-event': deleteEvent,
  'view-user-events': viewUserEvents,
  'toggle-attending-event': toggleAttendingEvent,
  'toggle-interested-event': toggleInterestedEvent
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
