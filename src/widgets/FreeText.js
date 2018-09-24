import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import renderHTML from 'react-render-html';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';

class FreeText extends React.Component {

  render() {

    return (
      <div>
        {renderHTML(this.props.text)}
      </div>
    );
  }
}

class FreeTextSettings extends React.Component {
  state = {
    editorState: EditorState.createEmpty(),
  };

  onEditorStateChange = (editorState) => {
    let html = stateToHTML(editorState.getCurrentContent());
    this.setState({
      editorState
    });
    this.props.addWidgetSetting('text', html);
  };

  handleClose = () => {
    this.setState({
      editorState: EditorState.createEmpty()
    });
    this.props.handleClose();
  };

  handleSubmit = (evt) => {
    this.setState({
      editorState: EditorState.createEmpty()
    });
    this.props.handleSubmit();
  };

  /*componentDidUpdate(prevProps, prevState, snapshot) {
    let html = stateToHTML(this.state.editorState.getCurrentContent());
    let text = this.props.text ? this.props.text : '<p><br></p>';
    if (text && html !== text) {
      const blocksFromHTML = convertFromHTML(text);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      this.setState({
        editorState: EditorState.createWithContent(contentState)
      });
    }
  }*/

  render () {

    return (
      <Dialog
        fullScreen
        open={this.props.open}
        onClose={this.handleClose}
        >
          <DialogTitle id="scroll-dialog-title">Settings</DialogTitle>
          <DialogContent>
            <FormControl required fullWidth margin = "normal">
              <FormLabel>Title</FormLabel>
              <TextField
                type     = "text"
                name     = "title"
                id       = "title"
                value    = {this.props.title}
                onChange = {(s) => {this.props.addWidgetSetting('title', s)}}/>
            </FormControl>
            <FormControl fullWidth margin = "normal">
              <FormLabel>Text</FormLabel>
              <Card className         = "card-container">
                <Editor editorState   = {this.state.editorState}
                  editorClassName     = "editor-content"
                  toolbarClassName    = "editor-toolbar"
                  onEditorStateChange = {this.onEditorStateChange}
                />
              </Card>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={(evt) => {this.handleSubmit()}} color="primary">
              Save
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}


export {FreeTextSettings, FreeText};
