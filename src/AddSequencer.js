import React, { Component } from 'react';
import { connect } from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import './AddSequencer.css';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import FileDragContainer from './Containers/FileDragContainer';

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

  returnMenuItems = () => {
    return this.state.menuItemsArr.map((item, index) => {
      return <MenuItem value={index} key={item} primaryText={item} />;
    });
  };

  handleDropDownMenuChange = (e, index, value) => {
    const id = this.state.menuItemsArr[value];
    const sample = this.props.samples[id];

    if (value !== 0) {
      //close dialog and dispatch action
      this.props.dispatch({
        type: 'ADD_NEW_SEQUENCER',
        sequencerId: id + Date.now(),
        sample: sample
      });

      this.setState({ addSequencerDialogOpen: false });
    }
  };

  render() {
    return (
      <div className="add-sequencer-container">
        <FloatingActionButton onClick={this.handleOpenAddSequencerDialogClick}>
          <ContentAdd />{' '}
        </FloatingActionButton>

        <Dialog
          open={this.state.addSequencerDialogOpen}
          onRequestClose={this.handleDialogClose}
          className="dialog-root"
        >
          <div className="add-sequencer__dialog-container">
            <FileDragContainer handleDialogClose={this.handleDialogClose} />

            <div className="add-sequencer__dialog-menu-container">
              <DropDownMenu
                maxHeight={300}
                value={this.state.dropDownMenuValue}
                onChange={this.handleDropDownMenuChange}
              >
                {this.returnMenuItems()}
              </DropDownMenu>
            </div>
            <RaisedButton
              label="Add Sequencer"
              primary={true}
              onClick={this.handleAddSequencer}
            />
          </div>
        </Dialog>
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
