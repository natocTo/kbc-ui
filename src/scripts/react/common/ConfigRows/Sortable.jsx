import React from 'react';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => <span>::</span>); // This can be any component you want

const SortableItem = SortableElement(({value}) => <li><DragHandle /> {value}</li>);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem index={index} key={value} value={value}/>
      ))}
    </ul>
  );
});

export default React.createClass({
  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content">
          <SortableList items={['a', 'b', 'c']} lockAxis="y" useDragHandle={true} lockToContainerEdges={true}/>
        </div>
        <div className="col-md-3 kbc-main-sidebar" />
      </div>
    );
  }
});
