import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import axios from 'axios';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: theme.spacing.unit * 3,
  }),
});

class Annotation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starred: false
    };
  }

  starClick() {
    console.log('clicked');
    this.setState({
      starred: !this.state.starred
    });
    axios.post('/star', {
      state: !this.state.starred,
      label: this.props.word
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper
          className={classes.root}
          elevation={4}>
          <Typography variant="headline" component="p" style={{ fontSize: this.props.count * 5 }}>
            {this.props.word}
            <span class='star' onClick={this.starClick.bind(this)}>
              {this.state.starred ? <Star /> : <StarBorder />}
            </span>
          </Typography>
        </Paper>
      </div>
    );
  }
}

Annotation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Annotation);