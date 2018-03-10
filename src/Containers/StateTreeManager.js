import React, { Component } from 'react';
import { connect } from 'react-redux';
import Forage from 'react-localforage';

const wrapperStyling = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center'
};

const saveStateStyling = {
  width: '100px',
  height: '70px',
  background: 'yellow'
};

const loadStateStyling = {
  width: '100px',
  height: '70px',
  background: 'orange'
};

/*****************************/

class StateTreeManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saveState: false,
      loadState: false
    };
  }

  componentDidMount() {
    console.log('fooooo');
  }

  handleSaveStateClick = () => {
    let objStr = JSON.stringify(this.props.state);

    setTimeout(() => {
      this.setState({ saveState: true, stateString: objStr });

      // console.log('objStr:  ', objStr);
    }, 3000);
  };

  handleLoadStateClick = () => {
    this.setState({ loadState: true });
  };

  stateLoaded = state => {
    let stateObj = JSON.parse(state);

    setTimeout(() => {
      this.setState({ loadState: false });
      this.props.dispatch({ type: 'LOAD_STATE', stateObj });
    }, 3000);
  };

  render() {
    let { saveState, loadState, stateString } = this.state;
    let { state } = this.props;

    return (
      <div style={wrapperStyling}>
        <div onClick={this.handleSaveStateClick} style={saveStateStyling}>
          SAVE STATE
        </div>

        {saveState && (
          <Forage.SetItem itemKey={'state'} itemValue={stateString} />
        )}

        {loadState && (
          <Forage.GetItem
            itemKey="state"
            render={({ inProgress, value, error }) => {
              return (
                <div>
                  {error && <div>{error.message}</div>}
                  {inProgress && <progress />}
                  {value && this.stateLoaded(value)}
                </div>
              );
            }}
          />
        )}

        <div onClick={this.handleLoadStateClick} style={loadStateStyling}>
          LOAD STATE
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    state: state
  };
}

export default connect(mapStateToProps)(StateTreeManager);
