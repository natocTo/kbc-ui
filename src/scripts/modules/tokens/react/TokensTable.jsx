import React, {PropTypes} from 'react';
import {Table} from 'react-bootstrap';
import {List} from 'immutable';


export default React.createClass({

  propTypes: {
    tokens: PropTypes.object.isRequired
  },

  render() {
    return (
      <Table responsive className="table table-striped">
        <thead>
          <tr>
            <th>
              id
            </th>
            <th>
              Name
            </th>
            <th>
              Created
            </th>
            <th>
              Expires
            </th>
            <th>
              Can Read All files
            </th>
            <th>
              Component Access
            </th>
            <th>
              Buckets Permissions
            </th>
            <th>
              <button className="btn btn-success"> Create Token </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.props.tokens.map(this.renderTableRow).toArray()}
        </tbody>
      </Table>
    );
  },


  renderTableRow(token) {
    return (
      <tr key={token.get('id')}>
        <td>
          {token.get('id')}
        </td>
        <td>
          {token.get('description')}
        </td>
        <td>
          {token.get('created')}
        </td>
        <td>
          {token.get('expires') || 'never'}
        </td>
        <td>
          {token.get('canReadAllFileUploads') ? 'yes' : 'no'}
        </td>
        <td>
          {token.get('componentAccess', List()).count()}
        </td>
        <td>
          {token.get('bucketPermissions').count()}
        </td>
        <td>
          <ul>
            <li> edit token</li>
            <li> token detail</li>
            <li> delete token</li>
            <li> refresh token</li>
            <li> share/send token</li>
            <li> copy to cliboard/show</li>
          </ul>

        </td>
      </tr>
    );
  }
});
