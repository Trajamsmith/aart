import React from 'react';
import Annotation from './Annotation.jsx';
import $ from 'jquery';
import Collapse from '@material-ui/core/Collapse';

class WordCloud extends React.Component {
  constructor(props) {
    super(props);
  }

  convertToArray(obj) {
    let output = [];
    for (let prop in obj) {
      output.push([prop, obj[prop]]);
    }
    return output.sort((a, b) => b[1] - a[1]);
  }

  render() {
    let annotations = this.convertToArray(this.props.words).slice(0, 20);
    return (
      <div>
        <div className='artist-name'>{this.props.artist}</div>
        {annotations.map(word => {
          return (
            <Annotation word={word[0]} count={word[1]} />
          )
        })}
      </div>
    )
  }
}

export default WordCloud;