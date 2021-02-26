# Google oAuth 2.0 API's via node js

Sample code to do oAuth 2.0 with google

**tasks**

- [x] auth using googleapis package (index.js)
- [x] auth without using googleapis package (plain.js)

## Tools used

- node-fetch - to call the google apis
- express - api server
- querystring - to create querystring

## How to

- run `npm i` to install all packages
- then rename `keys.sample.js` to `keys.js`, provide your google client id and secret in it
- then call `/auth/google` to start a authorizaion page
- after that you will be redirected to the google authorization page
- after signing in you will be transferred to the /auth/google/callback where it will show user information
