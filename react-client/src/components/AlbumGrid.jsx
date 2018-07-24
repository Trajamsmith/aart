import React from 'react';
import $ from 'jquery';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Grow from '@material-ui/core/Grow';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  // gridList: {
  //   width: 400,
  //   height: 400,
  // },
  subheader: {
    width: '100%',
  },
});

function AlbumGrid(props) {
  console.log(props);
  return (
    <div>
      <GridList
        cellHeight={400}
        cols={3}>
        {props.albumUrls.map((url, i) => (
          <Grow
            in={true}
            style={{ transformOrigin: '0 0 0' }}
            {...(true ? { timeout: 200 * i } : {})}>
            <GridListTile>
              <img src={url[1]} />
              <div className="album-title">
                <GridListTileBar
                  title={url[0]}
                />
              </div>
            </GridListTile>

          </Grow>
        ))}
      </GridList>
    </div>
  );
}

export default AlbumGrid;