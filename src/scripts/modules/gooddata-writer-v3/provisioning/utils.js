import api from './api';
import Promise from 'bluebird';

export const ActionTypes = {
  CREATE: 'CREATE',
  USE_EXISTING: 'USE_EXISTING'
};

export const TokenTypes = {
  DEMO: 'demo',
  PRODUCTION: 'production',
  CUSTOM: 'custom'
};

export const ProvisioningStates = {
  NONE: 'NONE',
  OWN_CREDENTIALS: 'OWND_CREDENTIALS',
  KBC_NO_SSO: 'KBC_NO_SSO',
  KBC_WITH_SSO: 'KBC_WITH_SSO',
  ERROR: 'ERROR'
};

const isCustomToken = token => token === TokenTypes.CUSTOM;

export default {
  isNewProjectValid({ name, action, tokenType, customToken, login, password, pid }) {
    if (action === ActionTypes.CREATE) {
      return !!name && (isCustomToken(tokenType) ? !!customToken : true);
    }

    if (action === ActionTypes.USE_EXISTING) {
      return !!login && !!password && !!pid;
    }
    return false;
  },

  prepareProject({ name, action, tokenType, customToken, login, password, pid }) {
    if (action === ActionTypes.CREATE) {
      const token = isCustomToken(tokenType) ? customToken : tokenType;
      api.createProjectAndUser(name, token);
    } else {
      return Promise.resolve({
        pid,
        login,
        password
      });
    }
  },

  loadProvisioningData({ pid, login, password }) {
    const { NONE, OWN_CREDENTIALS, KBC_WITH_SSO, KBC_NO_SSO, ERROR } = ProvisioningStates;

    // no valid credentials stored
    if (!pid || !login || !password) {
      return Promise.resolve({ state: NONE });
    }

    return api.getProjectDetail(pid).then(
      ({ authToken }) =>
        api
          .getSSOAccess(pid)
          .then(({ link }) => ({ state: KBC_WITH_SSO, link, authToken }), () => ({ state: KBC_NO_SSO, authToken })),
      err => {
        if (err.status === 404) {
          return Promise.resolve({ state: OWN_CREDENTIALS });
        } else {
          return Promise.resolve({ state: ERROR, error: err });
        }
      }
    );
  }
};