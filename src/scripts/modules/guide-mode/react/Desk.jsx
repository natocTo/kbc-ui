import React from 'react';


export default React.createClass({

  propTypes: {
    linkToSettings: React.PropTypes.string.isRequired,
    lessons: React.PropTypes.object.isRequired,
    achievedLessonId: React.PropTypes.number.isRequired,
    openLessonModalFn: React.PropTypes.func.isRequired
  },

  render() {
    const { linkToSettings } = this.props;
    return (
      <div className="kbc-overview-component">
        <div className="guide-desk-container">
          <div className="guide-desk">
            <h2>Welcome to Keboola Connection</h2>
            <h1>Guide Mode</h1>
            <div className="row">
              <div className="col-xs-4">
                <ul>
                  {this.renderLessonList()}
                </ul>
              </div>
              <div className="col-xs-5">
                <p>
                  Learn all you need to know about Keboola Connection &ndash; our powerful and safe environment for working with data.
                  <br/>
                  <br/>
                  These lessons will walk you through the basic steps of creating a project: from loading and manipulating data to visualizing the results and automating the whole process.
                  <br/>
                  <br/>
                  Feel free to switch the Guide Mode off at any time. If needed, bring it back by going to
                  {' '}
                  <a className="guide-link" href={linkToSettings}>
                    Settings > Guide Mode.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderLessonList() {
    const { lessons, achievedLessonId, openLessonModalFn } = this.props;
    return Object.keys(lessons).map((lesson, key) => {
      return (
        <li key={key}>
          <a
            className={'guide-lesson-link' + (achievedLessonId < key ? ' guide-lesson-link-locked' : '')}
            href="#" onClick={(e) => {
              e.preventDefault();
              openLessonModalFn(key + 1);
            }}
          >
            Lesson {key + 1} - {lessons[key + 1].title}
          </a>
          {achievedLessonId < key && <i className="guide-lock fa fa-lock"/>}
        </li>
      );
    });
  }
});
