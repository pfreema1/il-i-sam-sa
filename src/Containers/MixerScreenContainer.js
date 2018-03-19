import React, { Component } from 'react';
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import MixerControlView from '../Components/MixerControlView';

const styling = {
  top: '60px', //height of toolbar
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

class MixerScreenContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      arrayOfVolumeVals: []
    };
  }

  createArrayOfVolumeVals = nextProps => {
    return nextProps.sequencersIdArr.map(
      sequencer => nextProps.sequencers[sequencer].volumeVal
    );
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      arrayOfVolumeVals: this.createArrayOfVolumeVals(nextProps)
    });
  }

  returnNewArrayOfVolumeVals = (indexOfChange, newValue) => {
    return this.state.arrayOfVolumeVals.map((volumeVal, index) => {
      if (index === indexOfChange) {
        return newValue;
      } else {
        return volumeVal;
      }
    });
  };

  handleVolumeChange = (index, e, newValue) => {
    this.setState({
      arrayOfVolumeVals: this.returnNewArrayOfVolumeVals(index, newValue)
    });
  };

  handleDragStop = (index, e) => {
    this.props.dispatch({
      type: 'CHANGE_VOLUME_VALUE',
      newVolumeVal: this.state.arrayOfVolumeVals[index],
      sequencerId: this.props.sequencersIdArr[index]
    });
  };

  render() {
    const { sequencersIdArr, sequencers } = this.props;

    return (
      <Drawer
        containerStyle={styling}
        width={'100%'}
        open={this.props.UiMode === 'mixer'}
        openSecondary={true}
      >
        {this.props.sequencersIdArr.map((sequencer, index) => {
          const sequencerName = sequencersIdArr[index];
          const sequencerVolume = this.state.arrayOfVolumeVals[index];

          return (
            <MixerControlView
              key={index}
              index={index}
              sequencerName={sequencerName}
              volumeVal={sequencerVolume}
              volumeChange={this.handleVolumeChange}
              volumeDragStop={this.handleDragStop}
            />
          );
        })}
      </Drawer>
    );
  }
}

function mapStateToProps(state) {
  //sequencers[id].volumeVal

  return {
    UiMode: state.UiMode,
    sequencersIdArr: state.sequencersIdArr,
    sequencers: state.sequencers
  };
}

export default connect(mapStateToProps)(MixerScreenContainer);
