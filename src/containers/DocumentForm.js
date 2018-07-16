import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import HRInfoSelect from '../components/HRInfoSelect';
import HRInfoLocations from '../components/HRInfoLocations';
import HRInfoAsyncSelect from '../components/HRInfoAsyncSelect';
import HRInfoFiles from '../components/HRInfoFiles';
import RelatedContent from '../components/RelatedContent';
import LanguageSelect from '../components/LanguageSelect';

import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';

import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';

import './DocumentForm.css';

class DocumentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
	  this.setState({ collapse: !this.state.collapse });
	}

  render() {
        const offices = this.props.doc.hasOperation
            ? (
			<FormControl fullWidth margin="normal">
				<Typography>Coordination hub(s)</Typography>
				<HRInfoSelect
					type="offices"
					spaces={this.props.doc.spaces}
					isMulti={true}
					onChange={(s) => this.props.handleSelectChange('offices', s)}
					value={this.props.doc.offices}/>
				<FormHelperText id="offices-text">
					Click on the field and select the coordination hub(s) the {this.props.typeLabel + ' '}
					refers to (if any).
				</FormHelperText>
			</FormControl>
			)
            : '';

        const disasters = this.props.doc.hasOperation
            ? (
				<FormControl fullWidth margin="normal">
					<Typography htmlFor="disasters">Disaster(s) / Emergency</Typography>
					<HRInfoSelect
						type="disasters"
						spaces={this.props.doc.spaces}
						isMulti={true}
						onChange={(s) => this.props.handleSelectChange('disasters', s)}
						value={this.props.doc.disasters}/>
					<FormHelperText id="disasters-text">
						Click on the field and select the disaster(s) or emergency the {this.props.typeLabel + ' '}
	                    refers to. Each disaster/emergency is associated with a number, called GLIDE, which is a common standard used by a wide network of organizations See
	                    <a href="http://glidenumer.net/?ref=hrinfo"> glidenumber.net</a>.
					</FormHelperText>
				</FormControl>
			)
            : '';

        const bundles = this.props.doc.hasOperation
            ? (
				<FormControl fullWidth margin="normal">
					<Typography htmlFor="bundles">Cluster(s)/Sector(s)</Typography>
					<HRInfoSelect
						type="bundles"
						spaces={this.props.doc.spaces}
						isMulti={true}
						onChange={(s) => this.props.handleSelectChange('bundles', s)}
						value={this.props.doc.bundles}/>
					<FormHelperText id="bundles-text">
						Indicate the cluster(s)/sector(s) the {this.props.label + ' '}
	                    refers to.
					</FormHelperText>
				</FormControl>
			)
            : '';

        return (
		<form noValidate="noValidate">
			<div className="form">
				<div className="form-primary">
					<FormControl required fullWidth margin="normal" error={!this.props.isValid(this.props.doc.label)}>
		                <Typography htmlFor="label">Title</Typography>
		                <TextField type="text"
							name="label"
							id="label"
							placeholder={'Enter the title of the ' + this.props.label}
							value={this.props.doc.label}
							onChange={this.props.handleInputChange}/>
						<FormHelperText id="label-text">
		                    Type the original title of the {this.props.label + ' '}. Try not to use abbreviations. To see Standards and Naming Conventions click
		                    <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.
		                </FormHelperText>
		            </FormControl>

					<FormControl required fullWidth margin="normal" error={!this.props.isValid(this.props.doc.publication_date)}>
		                <Typography htmlFor="publication_date">Original Publication Date</Typography>
						<MuiPickersUtilsProvider utils={MomentUtils}>
					        <DatePicker
								id="publication_date"
	  							name="publication_date"
								format="DD/MM/YYYY"
								placeholder="Select date"
	  							value={this.props.doc.publication_date}
	  							onChange={this.props.handleInputChange}
								leftArrowIcon={<i className="icon-arrow-left" />}
								rightArrowIcon={<i className="icon-arrow-right" />}
					        />
				      	</MuiPickersUtilsProvider>
						<FormHelperText id="publication_date-text">
		                    Indicate when the {this.props.label + ' '}
		                    has originally been published.
		                </FormHelperText>
		            </FormControl>

					<FormControl fullWidth margin="normal" error={!this.props.isValid(this.props.doc.body)}>
		                <Typography htmlFor="body">Description or Summary of Content</Typography>
		                <Editor editorState={this.props.editorState}
							wrapperClassName="editor-wrapper"
							editorClassName="editor-content"
							onEditorStateChange={this.props.onEditorStateChange}
						/>
		                <FormHelperText id="body-text">
		                    Try to always include here the text (in full or part of it) of the {this.props.label + ' '}
		                    (example: use the introduction or the executive summary). If no text is available add a description of the file(s) you are publishing.
		                </FormHelperText>
		            </FormControl>

					<FormControl required fullWidth margin="normal" error={!this.props.isValid(this.props.doc.files)}>
		                <Typography htmlFor="files">File(s)</Typography>
		                <HRInfoFiles onChange={(s) => this.props.handleSelectChange('files', s)} value={this.props.doc.files} />
							<FormHelperText id="files-text">
		                    Upload the file to publish from your computer, and specify its language. It is best to publish one file per record, however you can add more if needed. To see Standards and Naming Conventions click
		                    <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.
		                </FormHelperText>
		            </FormControl>
				</div>

				<div className="form-secondary">
			        <FormControl required fullWidth margin="normal" error={!this.props.isValid(this.props.doc.language)}>
			          	<Typography htmlFor="language">Language</Typography>
			          	<LanguageSelect value={this.props.doc.language}
							onChange={(s) => this.props.handleSelectChange('language', s)}
							className={this.props.isValid(this.props.doc.language) ? 'is-valid' : 'is-invalid'}/>
						<FormHelperText id="language-text">
		                    Select the language of the {this.props.label}.
		                </FormHelperText>
			        </FormControl>

					<FormControl required fullWidth margin="normal"
						error={(this.props.hrinfoType === 'documents' && !this.props.isValid(this.props.doc.document_type)) ||
							(this.props.hrinfoType === 'infographics' && !this.props.isValid(this.props.doc.infographic_type))}>
		                <Typography htmlFor={this.props.hrinfoType === 'documents'
		                        ? 'document_type'
		                        : 'infographic_type'}>
							{ this.props.hrinfoType === 'documents'
		                            ? 'Document type'
		                            : 'Infographic type' }
						</Typography>
		                {
		                    this.props.hrinfoType === 'documents'
		                        ? <HRInfoSelect type='document_types'
										onChange={(s) => this.props.handleSelectChange('document_type', s)}
										value={this.props.doc.document_type}
										className={this.props.isValid(this.props.doc.document_type)
		                                    ? 'is-valid'
		                                    : 'is-invalid'}/>
		                        : <HRInfoSelect type='infographic_types'
										onChange={(s) => this.props.handleSelectChange('infographic_type', s)}
										value={this.props.doc.infographic_type}
										className={this.props.isValid(this.props.doc.infographic_type)
		                                    ? 'is-valid'
		                                    : 'is-invalid'}/>
		                }
		                <FormHelperText>
		                    Select the {this.props.label + ' '}
		                    type and sub-type that best describe the {this.props.label}.
		                </FormHelperText>
		            </FormControl>

					<FormControl required fullWidth margin="normal" error={!this.props.isValid(this.props.doc.spaces)}>
		                <Typography htmlFor="spaces">Operation(s) / Webspace(s)</Typography>
		                <HRInfoSelect type="spaces" isMulti={true} onChange={(s) => this.props.handleSelectChange('spaces', s)} value={this.props.doc.spaces}/>
						<FormHelperText>
		                    Click on the field and select where to publish the {this.props.label + ' '}
		                    (operation, regional site or thematic site).
		                </FormHelperText>
		            </FormControl>

		            {bundles}
		            {offices}
		            {disasters}

		            <FormControl required fullWidth margin="normal" error={!this.props.isValid(this.props.doc.organizations)}>
		                <Typography htmlFor="organizations">Organization(s)</Typography>
		                <HRInfoAsyncSelect type="organizations"
							onChange={(s) => this.props.handleSelectChange('organizations', s)}
							value={this.props.doc.organizations}/>
						<FormHelperText id="organizations-text">
		                    Type in and select the source(s) of the {this.props.label}.
		                </FormHelperText>
		            </FormControl>

					<div className="more-info-button">
						{!this.state.collapse &&
							<Button color="primary" variant="outlined" onClick={this.toggle}>
								<i className="icon-plus" /> &nbsp; More Information
								</Button>
	      				}
						{this.state.collapse &&
							<Button color="primary" variant="outlined" onClick={this.toggle}>
								<i className="icon-cancel" /> &nbsp; Less Information
							</Button>
	  					}

						<Collapse in={this.state.collapse}>
							<FormControl fullWidth margin="normal">
								<Typography htmlFor="locations">Locations</Typography>
								<HRInfoLocations onChange={(s) => this.props.handleSelectChange('locations', s)}
									value={this.props.doc.locations}
									isMulti="isMulti"
									id="locations"/>
								<FormHelperText id="locations-text">
									Select from the menu the country(ies) the {this.props.label + ' '}
									is about and indicate more specific locations by selecting multiple layers (region, province, town).
								</FormHelperText>
							</FormControl>

							<FormControl fullWidth margin="normal">
								<Typography htmlFor="themes">Theme(s)</Typography>
								<HRInfoSelect type="themes"
									isMulti={true}
									onChange={(s) => this.props.handleSelectChange('themes', s)}
									value={this.props.doc.themes}
									id="themes"/>
								<FormHelperText id="themes-text">
									Click on the field and select all relevant themes. Choose only themes the {this.props.label}
									substantively refers to.
								</FormHelperText>
							</FormControl>

							<FormControl fullWidth margin="normal">
								<Typography htmlFor="related_content">Related Content</Typography>
								<RelatedContent onChange={(s) => this.props.handleSelectChange('related_content', s)}
									value={this.props.doc.related_content}
									id="related_content"/>
								<FormHelperText id="related_content-text">
									Add links to content that is related to the {this.props.label + ' '}
									you are publishing (example: language versions of the same {this.props.label}, or the link of the event the meeting minutes refer to) by indicating the title of the content and its url.
								</FormHelperText>
							</FormControl>
			        	</Collapse>
					</div>
				</div>
			</div>

			<div className="submission">
				{
					this.props.status !== 'submitting' &&
					<span>
						<Button color="primary" variant="contained" onClick={(evt) => this.props.handleSubmit(evt)}>Publish</Button>
						&nbsp;
						<Button color="secondary" variant="contained" onClick={(evt) => this.props.handleSubmit(evt, 1)}>Save as Draft</Button>
						&nbsp;
					</span>
				}
				{(this.props.status === 'submitting' || this.props.status === 'deleting') &&
					<CircularProgress />
				}
				{(this.props.match.params.id && this.props.status !== 'deleting') &&
					<span>
						<Button color="secondary" variant="contained" onClick={this.props.handleDelete}>Delete</Button>
					</span>
				}
			</div>
        </form>);
    }
}

export default DocumentForm;
