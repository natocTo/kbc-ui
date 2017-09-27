import React from 'react';
import EventDetail from './EventDetail';
import { fromJS } from 'immutable';


const link = {
  to: 'something'
};

const event = fromJS({
  'id': 612801925,
  'event': 'ext.docker.',
  'component': 'docker',
  'message': 'Running Component ex-generic-v2',
  'description': '',
  'type': 'info',
  'runId': '320118552',
  'created': '2017-09-25T19:59:02+0200',
  'configurationId': null,
  'objectId': '',
  'objectName': '',
  'objectType': '',
  'context': {
    'remoteAddr': '52.206.109.126',
    'httpReferer': null,
    'httpUserAgent': 'Keboola Storage API PHP Client\/7.0.2 docker',
    'apiVersion': 'v2'
  },
  'params': {},
  'results': {},
  'performance': {},
  'token': {
    'id': 3810,
    'name': 'martin@keboola.com'
  },
  'uri': 'https:\/\/connection.keboola.com\/v2\/storage\/events\/612801925',
  'attachments': []
});

describe('<EventDetail />', function() {
  it('should render event', function() {
    shallowSnapshot(
      <EventDetail
        event={event}
        link={link}
      />
    );
  });
});
