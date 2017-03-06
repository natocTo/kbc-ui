import React, {PropTypes} from 'react/addons';
import PhaseModal from '../../modals/Phase';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
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
