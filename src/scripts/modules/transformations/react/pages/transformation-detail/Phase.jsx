import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import PhaseModal from '../../modals/Phase';

export default React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    transformation: PropTypes.object.isRequired,
    bucketId: PropTypes.string.isRequired
  },

  render() {
    return (
      <PhaseModal
        transformation={this.props.transformation}
        bucketId={this.props.bucketId}
      />
    );
  }
});
