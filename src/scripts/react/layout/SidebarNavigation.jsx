import React from 'react';
import State from 'react-router/lib/State';
import Link from 'react-router/lib/components/Link';

import ApplicationStore from '../../stores/ApplicationStore';
import RoutesStore from '../../stores/RoutesStore';

const _pages = [
  {
    id: 'home',
    title: 'Overview',
    icon: 'kbc-icon-overview'
  },
  {
    id: 'extractors',
    title: 'Extractors',
    icon: 'kbc-icon-extractors'
  },
  {
    id: 'transformations',
    title: 'Transformations',
    icon: 'kbc-icon-transformations'
  },
  {
    id: 'writers',
    title: 'Writers',
    icon: 'kbc-icon-writers'
  },
  {
    id: 'orchestrations',
    title: 'Orchestrations',
    icon: 'kbc-icon-orchestrations'
  },
  {
    id: 'storage',
    title: 'Storage',
    icon: 'kbc-icon-storage'
  },
  {
    id: 'jobs',
    title: 'Jobs',
    icon: 'kbc-icon-jobs'
  },
  {
    id: 'applications',
    title: 'Applications',
    icon: 'kbc-icon-applications'
  }
];

const SidebarNavigation = React.createClass({
  mixins: [State],

  render() {
    return (
      <ul className="nav nav-tabs">
        {_pages.map(page => {
          return (
            <li className={this.isActive(page.id) ? 'active' : ''} key={page.id}>
              {RoutesStore.hasRoute(page.id) ? (
                <Link to={page.id}>
                  <span className={page.icon} />
                  <span>{page.title}</span>
                </Link>
              ) : (
                <a href={ApplicationStore.getProjectPageUrl(page.id)}>
                  <span className={page.icon} />
                  <span>{page.title}</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    );
  }
});

export default SidebarNavigation;
