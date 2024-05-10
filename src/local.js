
import {handler} from './index.js';
let event = {
  "begin": "2023-02-20T22:00:00.000Z",
  "end":   "2023-02-21T00:00:00.000Z",
  "local": true
};
handler(event).then((res) => {
    console.log(res);
});

