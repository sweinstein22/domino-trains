import React from 'react';
import './Domino.css';
import classnames from "classnames";
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

export class Domino extends React.Component {
  generateDots = (dotCount) => {
    const {tileIndex} = this.props;
    const insertBreak = (index) => {
      switch (dotCount) {
        case 4:
          return index === 1;
        case 5:
          return index === 1 || index === 2;
        case 7:
          return index === 3;
        case 8:
          return index === 4;
        case 10:
          return index === 5;
        case 11:
          return index === 6;
        case 13:
          return index === 7;
        case 14:
          return index === 8;
        default:
          return false;
      }
    };

    return <span>{
      Array.from({length: dotCount}).map((_, index) =>
        <span key={index}>
          <span {...{className: "dot", id: tileIndex}}/>
          {insertBreak(index) && <br/>}
        </span>
      )
    }</span>
  };

  dominoDotClassNames = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
    'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'];

  render() {
    const {value, flipTile, tileIndex, className, selectedIndex} = this.props;
    if (!value) return null;

    const left = value[0];
    const right = value[1];
    return (
      <span>
        <div {...{className: classnames("domino", className, {"selectable": flipTile}), id: tileIndex}}>
          <div {...{id: tileIndex, className: classnames("left", this.dominoDotClassNames[left])}}>
            {this.generateDots(left)}
          </div>
          <div {...{id: tileIndex, className: classnames("right", this.dominoDotClassNames[right])}}>
            {this.generateDots(right)}
          </div>
        </div>
        {flipTile && <div className="tile-controls">
          {selectedIndex
            ? <span className="selected-indicator">{selectedIndex}</span> : <span/>}
          <span className="rotate-icon">
            <RotateLeftIcon onClick={() => flipTile({tileIndex, newValue: [right, left]})}/>
          </span>
        </div>}
      </span>
    );
  }
}

export default Domino;
