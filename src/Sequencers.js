import React, { Component } from 'react';
import { connect } from 'react-redux';
import Sequencer from './Sequencer';

class Sequencers extends Component {
  constructor(props) {
    super(props);

    this.state = { sequencersToRender: [] };
  }

  componentDidMount() {
    this.setupSequencersToRender(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setupSequencersToRender(nextProps);
  }

  setupSequencersToRender = props => {
    let sequencersArr = [];

    for (let sequencer in props.sequencers) {
      sequencersArr.push(sequencer);
    }
    sequencersArr = sequencersArr.map((sequencer, index) => {
      return (
        <Sequencer key={index} sequencerId={props.sequencersIdArr[index]} />
      );
    });

    this.setState({
      sequencersToRender: sequencersArr
    });
  };

  render() {
    return (
      <div>
        {this.state.sequencersToRender.map(sequencer => {
          return sequencer;
        })}
      </div>
    );
  }
}

/*****************************/
const mapStateToProps = state => {
  return {
    sequencers: state.sequencers,
    sequencersIdArr: state.sequencersIdArr
  };
};

export default connect(mapStateToProps)(Sequencers);
