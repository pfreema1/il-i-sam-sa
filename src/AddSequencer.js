import React, { Component } from 'react';
import { connect } from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import './AddSequencer.css';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

import AddSequencerDialogContainer from './Containers/AddSequencerDialogContainer';

class AddSequencer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addSequencerDialogOpen: false,
      isLoadingFile: false,
      dropDownMenuValue: 0,
      menuItemsArr: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.samples !== this.props.samples) {
      let items = [];

      for (let sample in nextProps.samples) {
        items.push(sample);
      }

      //prepend info as first item
      items.unshift('Select Sample');

      this.setState({ menuItemsArr: items });
    }
  }

  handleOpenAddSequencerDialogClick = () => {
    this.setState({
      addSequencerDialogOpen: true
    });
  };

  handleAddSequencer = () => {
    this.setState({
      addSequencerDialogOpen: false
    });
  };

  handleDialogClose = () => {
    this.setState({
      addSequencerDialogOpen: false
    });
  };

  render() {
    return (
      <div className="add-sequencer-container">
        <FloatingActionButton onClick={this.handleOpenAddSequencerDialogClick}>
          <ContentAdd />{' '}
        </FloatingActionButton>

        <AddSequencerDialogContainer
          addSequencerDialogOpen={this.state.addSequencerDialogOpen}
          handleDialogClose={this.handleDialogClose}
          menuItemsArr={this.state.menuItemsArr}
          samples={this.props.samples}
        />
      </div>
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    samples: state.samples
  };
};

export default connect(mapStateToProps)(AddSequencer);
