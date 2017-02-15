import React from 'react';
import Immutable from 'immutable';
import request from './utils/request';
import Promise from 'bluebird';

export {React, Immutable, request, Promise};

export function getUrlParameterByName(name, searchString, defaultValue = '') {
  const escapedName = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]'),
    regex = new RegExp('[\\?&]' + escapedName + '=([^&#]*)'),
    results = regex.exec(searchString);
  if (!results) {
    return defaultValue;
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
}