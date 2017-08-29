'use strict';

const applicationServerPublicKey = 'BPg5S0ypMWTzy_ivSN3Qu2svqQOxjEHmX3KNHF0kHn892afHrg7eEgd2Y3nWRNogRLubCrC8K1eUVg6Zf8rbrfQ';
const applicationServerPrivateKey = 'urY3xQ7-oMxge7UrbV2Z13rYafcjpSvypxOTDgGXVJc';

const pushButton = document.querySelector('.js-push-btn');
const sendMsgBtn = document.getElementById('send-push-message');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
    .then(function (subscription) {
      console.log('User is subscribed.');

      updateSubscriptionOnServer(subscription);

      isSubscribed = true;

      updateBtn();
    })
    .catch(function (err) {
      console.log('Failed to subscribe the user: ', err);
      updateBtn();
    });
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
    .then(function (subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(function (error) {
      console.log('Error unsubscribing', error);
    })
    .then(function () {
      updateSubscriptionOnServer(null);

      console.log('User is unsubscribed.');
      isSubscribed = false;

      updateBtn();
    });
}

function initialiseUI() {
  pushButton.addEventListener('click', function () {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  sendMsgBtn.addEventListener('click', sendPushMessage);

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
    .then(function (subscription) {
      isSubscribed = !(subscription === null);

      updateSubscriptionOnServer(subscription);

      if (isSubscribed) {
        console.log('User IS subscribed.');
      } else {
        console.log('User is NOT subscribed.');
      }

      updateBtn();
    });
}

function sendPushMessage() {

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionString = subscriptionJson.textContent;
  const dataString = "Hello World!!!@LeonDawn";

  if (subscriptionString.length === 0) {
    return Promise.reject(new Error('Please provide a push subscription.'));
  }

  let subscriptionObject = null;
  try {
    subscriptionObject = JSON.parse(subscriptionString);
  } catch (err) {
    return Promise.reject(new Error('Unable to parse subscription as JSON'));
  }

  if (!subscriptionObject.endpoint) {
    return Promise.reject(new Error('The subscription MUST have an endpoint'));
  }

  if (subscriptionObject.endpoint.indexOf('…') !== -1) {
    return Promise.reject(new Error('The subscription endpoint appears to be ' +
      'truncated (It has \'...\' in it).\n\nDid you copy it from the console ' +
      'in Chrome?')
    );
  }

  return fetch('/api/send-push-msg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subscription: subscriptionObject,
      data: dataString,
      applicationKeys: {
        public: applicationServerPublicKey,
        private: applicationServerPrivateKey,
      }
    })
  }).then((response) => {
    if (response.status !== 200) {
      return response.text()
        .then((responseText) => {
          throw new Error(responseText);
        });
    }
  });
}


if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
    .then(function (swReg) {
      console.log('Service Worker is registered', swReg);

      swRegistration = swReg;
      initialiseUI();
    })
    .catch(function (error) {
      console.error('Service Worker Error', error);
    });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
