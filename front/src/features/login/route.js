// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html
// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html
import { LoginDefaultPage } from './';

export default {
  path: 'login',
  name: 'Login',
  childRoutes: [
    { path: '/login', name: 'Login', component: LoginDefaultPage },
    { path: '/signup', name: 'Sign up', component: LoginDefaultPage },
  ],
};
