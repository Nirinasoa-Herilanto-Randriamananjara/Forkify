// STORE ALL METHODS USES BY THE APPLICATIONS

import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchApi = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchApi, timeout(TIMEOUT_SEC)]);
    const { data } = await res.json();

    if (!res.ok) throw new Error(`(${res.status}) ${data.message}`);

    return data;
  } catch (error) {
    throw error;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const { data } = await res.json();

//     if (!res.ok) throw new Error(`(${res.status}) ${data.message}`);

//     return data;
//   } catch (error) {
//     // throwing error, when the promise is fullfield due to "return data;" statement
//     throw error;
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const postData = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });

//     const res = await Promise.race([postData, timeout(TIMEOUT_SEC)]);

//     const { data } = await res.json();

//     if (!res.ok) throw new Error(`(${res.status}) ${data.message}`);

//     return data;
//   } catch (error) {
//     throw error;
//   }
// };