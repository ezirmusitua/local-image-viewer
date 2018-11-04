import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import GalleryPage from './containers/GalleryPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.GALLERY} component={GalleryPage} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
