// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';
// import Dialog from 'material-ui/Dialog';
// import './AddSequencer.css';
// import DropDownMenu from 'material-ui/DropDownMenu';
// import MenuItem from 'material-ui/MenuItem';
// import RaisedButton from 'material-ui/RaisedButton';
// import CircularProgress from 'material-ui/CircularProgress';

// class AddSequencerDialogContainer extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {};

//   }

//   render() {
//     return(
//       <Dialog
//           open={this.state.addSequencerDialogOpen}
//           onRequestClose={this.handleDialogClose}
//           className="dialog-root"
//         >
//           {this.state.isLoadingFile ? (
//             <div className="add-sequencer__dialog-loading-container">
//               <CircularProgress size={80} thickness={7} />
//               <h1>Loading Sample</h1>
//             </div>
//           ) : (
//             <div className="add-sequencer__dialog-container">
//               <div
//                 onDragEnd={this.handleDragEnd}
//                 onDragOver={this.handleDragOver}
//                 onDrop={this.handleFileDrop}
//                 className="add-sequencer__dialog-file-drop-container"
//               >
//                 drag file here bruh
//               </div>
//               <div className="add-sequencer__dialog-menu-container">
//                 <DropDownMenu
//                   maxHeight={300}
//                   value={this.state.dropDownMenuValue}
//                   onChange={this.handleDropDownMenuChange}
//                 >
//                   {this.returnMenuItems()}
//                 </DropDownMenu>
//               </div>
//               <RaisedButton
//                 label="Add Sequencer"
//                 primary={true}
//                 onClick={this.handleAddSequencer}
//               />
//             </div>
//           )}
//         </Dialog>
//     );
//   }
// }

// /*****************************/

// export default AddSequencerDialogContainer;
