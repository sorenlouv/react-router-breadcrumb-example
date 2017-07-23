import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Route from 'route-parser';

const isFunction = value => typeof value === 'function';

const getPathTokens = pathname => {
  const paths = ['/'];

  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });

  return paths;
};

function getRouteMatch(routes, path) {
  return Object.keys(routes)
    .map(key => {
      const params = new Route(key).match(path);
      return {
        didMatch: params !== false,
        params,
        key
      };
    })
    .filter(item => item.didMatch)[0];
}

function getBreadcrumbs({ routes, match, location }) {
  const pathTokens = getPathTokens(location.pathname);
  return pathTokens.map((path, i) => {
    const routeMatch = getRouteMatch(routes, path);
    const routeValue = routes[routeMatch.key];
    const name = isFunction(routeValue)
      ? routeValue(routeMatch.params)
      : routeValue;
    return { name, path };
  });
}

function Breadcrumbs({ routes, match, location }) {
  const breadcrumbs = getBreadcrumbs({ routes, match, location });

  return (
    <div>
      Breadcrumb:{' '}
      {breadcrumbs.map((breadcrumb, i) =>
        <span key={breadcrumb.path}>
          <Link to={breadcrumb.path}>
            {breadcrumb.name}
          </Link>
          {i < breadcrumbs.length - 1 ? ' / ' : ''}
        </span>
      )}
    </div>
  );
}

export default withRouter(Breadcrumbs);
