import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import plusSignIcon from '../../icons/plusSignIcon.svg';

const DropDownMenuStyling = {
  width: '75%'
};

/*****************************/

const PatternIndicatorView = ({
  currentPatternIndex,
  handlePatternChange,
  handleAddPatternClick,
  patternsArr,
  addPatternRef
}) => (
  <div className="pattern-indicator-wrapper">
    <DropDownMenu
      style={DropDownMenuStyling}
      underlineStyle={{ visibility: 'hidden' }}
      maxHeight={300}
      value={currentPatternIndex}
      onChange={handlePatternChange}
      labelStyle={{
        textOverflow: 'none',
        marginTop: '-5px',
        fontFamily: '"Oswald", sans-serif'
      }}
      iconStyle={{
        margin: '-5px -10px 0 0',
        color: 'RGBA(130, 130, 123, 1.00)'
      }}
    >
      {patternsArr.map((item, index) => {
        return <MenuItem key={index} value={index} primaryText={item} />;
      })}
    </DropDownMenu>
    <div
      ref={addPatternRef}
      onClick={handleAddPatternClick}
      className="pattern-indicator__add-pattern"
    >
      <img
        className="pattern-indicator__plus-sign-icon"
        src={plusSignIcon}
        alt="plus sign icon"
      />
    </div>
  </div>
);

export default PatternIndicatorView;
