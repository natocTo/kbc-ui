React = require 'react'

NewTransformationBucketModal = React.createFactory(require '../modals/NewTransformationBucket')

module.exports = React.createClass
  displayName: 'NewTransformationBucketButton'

  render: ->
    NewTransformationBucketModal null
