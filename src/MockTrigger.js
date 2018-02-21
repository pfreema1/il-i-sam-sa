import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MockTrigger.css';

class MockTrigger extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let { barStarter, isTriggered } = this.props;

    return (
      <div
        className={
          'mock-trigger ' +
          (barStarter ? 'bar-starter ' : '') +
          (isTriggered ? '' : 'disabled')
        }
      />
    );
  }
}

export default MockTrigger;
