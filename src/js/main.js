// DOM Elements
const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');

// Set base URL for Axios
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';

// Request Interceptor
axios.interceptors.request.use(
  function (config) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = 'Bearer  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30'; // Dummy token
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response Interceptor
axios.interceptors.response.use(
  function (response) {
    console.log('Request successful');
    return response;
  },
  function (error) {
    console.log(error.response);
    return Promise.reject(error);
  }
);

// GET request
const get = () => {
  axios
    .get('posts', {
      params: { _limit: 10 },
    })
    .then((response) => renderOutput(response));
};

// POST request
const post = () => {
  const data = {
    title: 'foo',
    body: 'bar',
    userId: 1,
  };
  axios.post('posts', data).then((response) => renderOutput(response));
};

// PUT request
const put = () => {
  const data = {
    id: 1,
    title: 'foo',
    body: 'bar',
    userId: 1,
  };
  axios.put('posts/1', data).then((response) => renderOutput(response));
};

// PATCH request (was using PUT by mistake)
const patch = () => {
  const data = {
    title: 'Laravel',
  };
  axios.patch('posts/1', data).then((response) => renderOutput(response));
};

// DELETE request
const del = () => {
  axios.delete('posts/2').then((response) => renderOutput(response));
};

// Multiple requests (Promise.all)
const multiple = () => {
  Promise.all([
    axios.get('posts?_limit=5'),
    axios.get('users?_limit=5'),
  ]).then(([postsRes, usersRes]) => {
    console.log('Posts:', postsRes.data);
    console.log('Users:', usersRes.data);
    renderOutput(postsRes); // Just displaying posts as example
  });
};

// Transforming the response
const transform = () => {
  const config = {
    params: { _limit: 5 },
    transformResponse: [
      function (data) {
        // Modify or process data before it's returned
        return JSON.parse(data);
      },
    ],
  };
  axios.get('posts', config).then((response) => renderOutput(response));
};

// Error handling example (invalid endpoint)
const errorHandling = () => {
  axios
    .get('postsz') // Wrong endpoint
    .then((response) => renderOutput(response))
    .catch((error) => {
      renderOutput(error.response);
      console.log(error.response);
    });
};

// Cancel request example using AbortController
const cancel = () => {
  const controller = new AbortController();
  const config = {
    params: { _limit: 5 },
    signal: controller.signal,
  };

  axios
    .get('posts', config)
    .then((response) => renderOutput(response))
    .catch((e) => {
      console.log(e.message); // Will print "canceled"
    });

  controller.abort(); // Cancel the request immediately
};

// Clear output area
const clear = () => {
  statusEl.innerHTML = '';
  statusEl.className = '';
  dataEl.innerHTML = '';
  headersEl.innerHTML = '';
  configEl.innerHTML = '';
};

// Render Axios response
const renderOutput = (response) => {
  // Set status styling based on code
  const status = response.status;
  statusEl.removeAttribute('class');
  let statusElClass =
    'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
  if (status >= 500) {
    statusElClass += ' bg-red-100 text-red-800';
  } else if (status >= 400) {
    statusElClass += ' bg-yellow-100 text-yellow-800';
  } else if (status >= 200) {
    statusElClass += ' bg-green-100 text-green-800';
  }

  statusEl.innerHTML = status;
  statusEl.className = statusElClass;

  // Render response data
  dataEl.innerHTML = JSON.stringify(response.data, null, 2);
  Prism.highlightElement(dataEl);

  // Render headers
  headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
  Prism.highlightElement(headersEl);

  // Render config
  configEl.innerHTML = JSON.stringify(response.config, null, 2);
  Prism.highlightElement(configEl);
};

// Event listeners for buttons
document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);
