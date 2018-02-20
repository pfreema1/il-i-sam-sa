import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';

const SynthesizerStyle = {
  width: '10vw',

  display: 'inline-block',
  height: '100px'
};
/*****************************/

class Synthesizer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      synthEditOpen: false,
      chosenSynth: props.sequencers[props.sequencerId].synthesizer
    };
  }

  handleClick = () => {
    this.setState({ synthEditOpen: true });

    this.props.dispatch({
      type: 'EDITING_SYNTHESIZER',
      sequencerBeingEditedId: this.props.sequencerId
    });
  };

  handleDialogClose = () => {
    this.setState({ synthEditOpen: false });

    this.props.dispatch({
      type: 'EDITING_SYNTHESIZER',
      sequencerBeingEditedId: null
    });
  };

  handleSynthChange = (event, index, value) => {
    this.setState({ chosenSynth: value });
    this.props.dispatch({ type: 'SYNTHESIZER_CHANGED', newSynthNum: value });
  };

  render() {
    return (
      <div>
        <RaisedButton
          onClick={this.handleClick}
          label=""
          style={SynthesizerStyle}
          backgroundColor="skyblue"
        >
          synth
        </RaisedButton>
        <Dialog
          open={this.state.synthEditOpen}
          onRequestClose={this.handleDialogClose}
        >
          <SelectField
            floatingLabelText="Choose Synth"
            value={this.state.chosenSynth}
            onChange={this.handleSynthChange}
          >
            <MenuItem value={1} primaryText="AMSynth" />
            <MenuItem value={2} primaryText="DuoSynth" />
            <MenuItem value={3} primaryText="FMSynth" />
            <MenuItem value={4} primaryText="MembraneSynth" />
            <MenuItem value={5} primaryText="MetalSynth" />
            <MenuItem value={6} primaryText="MonoSynth" />
            <MenuItem value={7} primaryText="NoiseSynth" />
            <MenuItem value={8} primaryText="PluckSynth" />
          </SelectField>
        </Dialog>
      </div>
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    sequencerBeingEditedId: state.sequencerBeingEditedId,
    sequencers: state.sequencers
  };
};

export default connect(mapStateToProps)(Synthesizer);
