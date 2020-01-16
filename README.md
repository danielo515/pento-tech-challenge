# Pento tech challenge by Daniel Rodriguez

[![Greenkeeper badge](https://badges.greenkeeper.io/danielo515/pento-tech-challenge.svg)](https://greenkeeper.io/)

The entire solution is publicly available at: https://pento.danielo.es

## Testing the back locally
For testing the backend locally you will need the serverless framework installed.
After that, you just run `yarn dev` and an offline version will be available for testing

## Included Postman collection
For easiness of API testing and discovery there is a Postam collection included.
For instructions about how to import your collection into Postman please take a look [at this article ](https://learning.getpostman.com/docs/postman/collections/data-formats/#importing-postman-data).

The collection is ordered as it is intended to be used. First you sign in, then you login, create a session, list sessions, close a session, and finally delete it.
Each request populates local environment variables that are used on the next, so in order to get a token for all the requests all you need to do is login first.

### Collection runner
It is possible to use the collection runner to generate a bunch of valid time tracking sessions.
`Create session` will create a session with some random values (name, date) and set the local environment so `Close session` closes the same session with an already set close date.
`Sign up` is not an idempotent action, you can only sign up once, so my recommendation for the collection runner is to:
- Login first manually
- Activate collection runner and select only `Create Session` and `Close session` (optionally `List sessions`)
- Run as many times as you want. We recommend short bursts of 8-10

Take a look at the screenshot for an example:

![collection runner screenshot](./collection-runnner.png "col-runner")

## Testing the frontend locally
To start the frontend locally for the first time please run 
```
yarn && yarn start
```
After that just `yarn start` (or `npm start`) will be required. The frontend points to the dev environment, so once you start it locally you can freely test it without having to start a local backend.
Backend and fronted are not specifically designed to be tested locally at the same time, but it is possible.
If you want to test the frontend with the backend locally:
- Start the backend first following the instructions for it
- Edit `.env` file on the frontend folder and change the variable named `REACT_APP_BACKEND_URL` to point to the local backend (by default `http://localhost:3000`)
- Start the frontend locally by running `yarn start`

## Details
For details about the back and the front please take a look at their respective folders

## Recomendations
Albeit it is possible to open this entire repository with a single instance of VSCode it is recommended to open each subfolder using a dedicated instance.
This will ease some tasks like debugging and terminal management