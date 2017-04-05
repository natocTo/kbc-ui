React = require 'react'

NewTransformationBucketModal = React.createFactory(require '../modals/NewTransformationBucket')

module.exports = React.createClass
  displayName: 'NewTransformationBucketButton'

  props: {
    label: React.PropTypes.string
  }

  getDefaultProps: ->
    {
      label: "Add Bucket"
    }

  render: ->
    NewTransformationBucketModal {label: @props.label}
