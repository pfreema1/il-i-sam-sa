import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const PatternIndicatorView = ({
  currentPatternIndex,
  handlePatternChange,
  handleAddPatternClick,
  patternsArr
}) => (
  <div className="pattern-indicator-wrapper">
    <DropDownMenu
      style={{ width: '75%' }}
      maxHeight={300}
      value={currentPatternIndex}
      onChange={handlePatternChange}
    >
      {patternsArr.map((item, index) => {
        return <MenuItem key={index} value={index} primaryText={item.name} />;
      })}
    </DropDownMenu>
    <div
      onClick={handleAddPatternClick}
      className="pattern-indicator__add-pattern"
    >
      +
    </div>
  </div>
);

export default PatternIndicatorView;
