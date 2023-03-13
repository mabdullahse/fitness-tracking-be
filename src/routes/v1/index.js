const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const exerciseRoute = require('./exercise.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/exercises',
    route: exerciseRoute,
  },
];

const devRoutes = [
  // routes available only in development mode 
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
