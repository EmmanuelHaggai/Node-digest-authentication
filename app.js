import { DigestClient } from 'http-digest-client';
import fetch from 'node-fetch';

const url = 'http://192.168.100.12/json_rpc';
const data = {
  method: 'get_block_count',
};

const username = 'username';
const password = 'password';

const headers = {
  'Content-Type': 'application/json',
};

const client = new DigestClient(username, password);

fetch(url, { method: 'GET', headers })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.text();
  })
  .then((digestDetails) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        ...headers,
        Authorization: client.generateAuthorizationHeader(url, 'POST', digestDetails),
      },
      body: JSON.stringify(data),
    };

    return fetch(url, requestOptions);
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
