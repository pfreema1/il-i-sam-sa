import React, { Component } from 'react';

class SampleSelectContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="add-sequencer__dialog-menu-container">
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

export default SampleSelectContainer;
