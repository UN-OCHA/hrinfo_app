import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class DownloadButton extends React.Component {

  state = {
    anchor: null,
    openMenuId: null,
  };

  handleClick = (e, menuId) => {
    this.setState({
      anchor: e.currentTarget,
      openMenuId: menuId
    });
  };

  handleClose = () => {
    this.setState({ anchor: null });
  };

  render () {
    const {item} = this.props;
    const {anchor, openMenuId} = this.state;

    let files = '';
    if (item.files) {
      if (item.files.length === 1) {
        files = <Button href={item.files[0].file.url} variant="outlined" color="primary">Download</Button>;
      }
      else {
        const that = this;
        const menuId = 'download-menu-' + item.id;
        files = <span><Button
          aria-owns={anchor ? menuId : null}
          aria-haspopup="true"
          onClick={(e) => {this.handleClick(e, menuId)}}
          variant="outlined"
          color="primary"
        >
          Download
        </Button>
        <Menu
          id={menuId}
          anchorEl={anchor}
          open={Boolean(anchor) && openMenuId === menuId }
          onClose={this.handleClose}
        >
          {item.files.map(function (file) {
            return (<MenuItem key={file.file.fid} onClick={that.handleClose}><a href={file.file.url} className="link">{file.file.filename}</a></MenuItem>);
          })}
        </Menu></span>;
      }
    }
    return files;
  }
}

export default DownloadButton;
