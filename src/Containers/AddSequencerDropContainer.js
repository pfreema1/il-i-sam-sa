import React, { Component } from 'react';
import { connect } from 'react-redux';
import './FileDragContainer.css';
import FileDragContainer from '../Containers/FileDragContainer';
import SampleSelectContainer from '../Containers/SampleSelectContainer';
import FileDragLoadingComponent from '../Components/FileDragLoadingComponent';

const wrapperStyling = {
  width: '130px',
  height: '200px',
  // border: '5px dashed RGBA(130, 130, 123, 1.00)',
  borderRadius: '2px',
  marginLeft: '5px',
  boxSizing: 'border-box',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  fontSize: '15px'
  // marginTop: '10px'
};

/*****************************/

class AddSequencerDropContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // addSequencerDialogOpen: false,
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

  handleIsLoading = isLoading => {
    this.setState({ isLoadingFile: isLoading });
  };

  render() {
    return (
      <div>
        {this.state.isLoadingFile ? (
          <FileDragLoadingComponent />
        ) : (
          <div style={wrapperStyling}>
            <FileDragContainer handleIsLoading={this.handleIsLoading} />
            <div>or</div>
            <SampleSelectContainer
              // handleDialogClose={props.handleDialogClose}
              menuItemsArr={this.state.menuItemsArr}
              samples={this.props.samples}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    samples: state.samples
  };
};

export default connect(mapStateToProps)(AddSequencerDropContainer);
