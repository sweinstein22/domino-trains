## Deploy client app

Deployed using firebase

if not already installed, run `npm install -g firebase-tools` to install the firebase CLI tools

login with `firebase login`
run `yarn build` to create a production build
run `firebase serve` to serve up the app locally
run `firebase deploy` to deploy the application

## Deploying multiple versions of the app

Currently this app is not set up to support multiple games at once. If you would
like to deploy a second instance of the app, set up an additional app in the
same firebase project.

Adjust settings following guidelines in [this
article](https://firebase.googleblog.com/2018/08/one-project-multiple-sites-plus-boost.html)
(Note: adjustments to the `firebase.json` hosting object to have a separate
entry for each site and adding targets using the CLI are both necessary steps)

Change the server address and config details in `src/ServerAPI.js`. (Config
details can be found under settings for the web app, select CDN under the 'Firebase
SDK Snippet' section)

Run `firebase deploy --only hosting:domino-trains-x` to deploy to the xth instance of the game

## Deploy server app

Deployed using Heroku

login using `heroku login`

if remote tracking is not already set up, run `heroku git:remote -a domino-trains-server`

to push app, run `git subtree push --prefix express-server heroku master`

## Available Scripts

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
