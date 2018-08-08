import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
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

  render () {

    return (
      <Dialog
        fullScreen
        open={this.props.open}
        onClose={this.props.handleClose}
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
            <Button onClick={this.props.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={(evt) => {this.props.handleSubmit()}} color="primary">
              Add Widget
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}


export {FreeTextSettings, FreeText};
