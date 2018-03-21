import React, { Component } from 'react';
import { connect } from 'react-redux';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class SampleSelectContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropDownMenuValue: 0
    };
  }

  returnMenuItems = () => {
    return this.props.menuItemsArr.map((item, index) => {
      return <MenuItem value={index} key={item} primaryText={item} />;
    });
  };

  handleDropDownMenuChange = (e, index, value) => {
    const id = this.props.menuItemsArr[value];
    const sample = this.props.samples[id];

    if (value !== 0) {
      //close dialog and dispatch action
      this.props.dispatch({
        type: 'ADD_NEW_SEQUENCER',
        sequencerId: id + Date.now(),
        sample: sample
      });

      // this.setState({ addSequencerDialogOpen: false });
      // this.props.handleDialogClose();
    }
  };

  render() {
    return (
      <div>
        <DropDownMenu
          maxHeight={300}
          value={this.state.dropDownMenuValue}
          onChange={this.handleDropDownMenuChange}
        >
          {this.returnMenuItems()}
        </DropDownMenu>
      </div>
    );
  }
}

export default connect()(SampleSelectContainer);
