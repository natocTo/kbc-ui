import React from 'react';
import ConfirmModal from './ConfirmModal';

describe('<ConfirmModal />', function() {
  it('render with show=false', function() {
    shallowSnapshot(
      <ConfirmModal
        show={false}
        buttonType="success"
        buttonLabel="Save"
        text={<span>some text</span>}
        title="Some title"
        onConfirm={() => null}
        onHide={() => null}
      />
    );
  });

  it('render with show=true', function() {
    shallowSnapshot(
      <ConfirmModal
        show={true}
        buttonType="success"
        buttonLabel="Save"
        text={<span>some text</span>}
        title="Some title"
        onConfirm={() => null}
        onHide={() => null}
      />
    );
  });
});
