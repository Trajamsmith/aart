import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
});

function Welcome(props) {
  const { classes } = props;
  return (
    <div>
      <Paper
        className={classes.root}
        elevation={4}
        style={{ textAlign: 'center', margin: '200px' }}>
        <Typography variant="headline" component="h3">
          Welcome to AArt!
        </Typography>
        <Typography component="p">
          Search up top to find album art by your favorite artists!
        </Typography>
      </Paper>
    </div>
  );
}

Welcome.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Welcome);