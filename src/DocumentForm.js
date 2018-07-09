import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Collapse } from 'reactstrap';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from 'react-select';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import HRInfoSelect from './HRInfoSelect';
import HRInfoLocations from './HRInfoLocations';
import HRInfoAsyncSelect from './HRInfoAsyncSelect';
import HRInfoFiles from './HRInfoFiles';
import RelatedContent from './RelatedContent';
import LanguageSelect from './LanguageSelect';

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
            ? (<FormGroup>
                <Label for="offices">Coordination hub(s)</Label>
                <HRInfoSelect type="offices" spaces={this.props.doc.spaces} isMulti={true} onChange={(s) => this.props.handleSelectChange('offices', s)} value={this.props.doc.offices}/>
                <FormText color="muted">
                    Click on the field and select the coordination hub(s) the {this.props.typeLabel}
                    refers to (if any).
                </FormText>
            </FormGroup>)
            : '';

        const disasters = this.props.doc.hasOperation
            ? (<FormGroup>
                <Label for="disasters">Disaster(s) / Emergency</Label>
                <HRInfoSelect type="disasters" spaces={this.props.doc.spaces} isMulti={true} onChange={(s) => this.props.handleSelectChange('disasters', s)} value={this.props.doc.disasters}/>
                <FormText color="muted">
                    Click on the field and select the disaster(s) or emergency the {this.props.typeLabel}
                    refers to. Each disaster/emergency is associated with a number, called GLIDE, which is a common standard used by a wide network of organizations See
                    <a href="http://glidenumer.net/?ref=hrinfo">glidenumber.net</a>.
                </FormText>
            </FormGroup>)
            : '';

        const bundles = this.props.doc.hasOperation
            ? (<FormGroup>
                <Label for="bundles">Cluster(s)/Sector(s)</Label>
                <HRInfoSelect type="bundles" spaces={this.props.doc.spaces} isMulti={true} onChange={(s) => this.props.handleSelectChange('bundles', s)} value={this.props.doc.bundles}/>
                <FormText color="muted">
                    Indicate the cluster(s)/sector(s) the {this.props.label}
                    refers to.
                </FormText>
            </FormGroup>)
            : '';

        return (<Form onSubmit={this.props.handleSubmit} noValidate="noValidate" className={this.props.status === 'was-validated'
                ? 'was-validated bg-white my-3 p-3 row'
                : 'bg-white my-3 p-3 row'}>
			<div className="col-md-6">
				<FormGroup className="required">
	                <Label for="label">Title</Label>
	                <Input type="text" name="label" id="label" placeholder={'Enter the title of the ' + this.props.label} required="required" value={this.props.doc.label} onChange={this.props.handleInputChange}/>
	                <FormText color="muted">
	                    Type the original title of the {this.props.label}. Try not to use abbreviations. To see Standards and Naming Conventions click
	                    <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.
	                </FormText>
	                <div className="invalid-feedback">
	                    Please enter a document title
	                </div>
	            </FormGroup>

				<FormGroup className="required">
	                <Label for="publication_date">Original Publication Date</Label>
	                <Input type="date" id="publication_date" name="publication_date" value={this.props.doc.publication_date} onChange={this.props.handleInputChange} required="required"/>
	                <FormText color="muted">
	                    Indicate when the {this.props.label + ' '}
	                    has originally been published.
	                </FormText>
	                <div className="invalid-feedback">
	                    You must enter a publication date
	                </div>
	            </FormGroup>
			</div>

			<div className="col-md-6">
        <FormGroup className="required">
          <Label for="language">Language</Label>
          <LanguageSelect value={this.props.doc.language} onChange={(s) => this.props.handleSelectChange('language', s)} className={this.props.isValid(this.props.doc.language) ? 'is-valid' : 'is-invalid'}/>
          <div className="invalid-feedback">
            Please select a language
          </div>
        </FormGroup>

				<FormGroup className="required">
	                <Label for={this.props.hrinfoType === 'documents'
	                        ? 'document_type'
	                        : 'infographic_type'}>{
	                        this.props.hrinfoType === 'documents'
	                            ? 'Document type'
	                            : 'Infographic type'
	                    }</Label>
	                {
	                    this.props.hrinfoType === 'documents'
	                        ? <HRInfoSelect type='document_types' onChange={(s) => this.props.handleSelectChange('document_type', s)} value={this.props.doc.document_type} className={this.props.isValid(this.props.doc.document_type)
	                                    ? 'is-valid'
	                                    : 'is-invalid'}/>
	                        : <HRInfoSelect type='infographic_types' onChange={(s) => this.props.handleSelectChange('infographic_type', s)} value={this.props.doc.infographic_type} className={this.props.isValid(this.props.doc.infographic_type)
	                                    ? 'is-valid'
	                                    : 'is-invalid'}/>
	                }
	                <FormText color="muted">
	                    Select the {this.props.label + ' '}
	                    type and sub-type that best describe the {this.props.label}.
	                </FormText>
	                <div className="invalid-feedback">
	                    You must select a {this.props.label}
	                    type
	                </div>
	            </FormGroup>
			</div>

			<div className="col-md-12">
	            <FormGroup>
	                <Label for="body">Description or Summary of Content</Label>
	                <Editor editorState={this.props.editorState} wrapperClassName="demo-wrapper" editorClassName="demo-editor" onEditorStateChange={this.props.onEditorStateChange}/>
	                <FormText color="muted">
	                    Try to always include here the text (in full or part of it) of the {this.props.label + ' '}
	                    (example: use the introduction or the executive summary). If no text is available add a description of the file(s) you are publishing.
	                </FormText>
	            </FormGroup>
			</div>

			<div className="col-md-6">
	            <FormGroup className="required">
	                <Label for="files">File(s)</Label>
	                <HRInfoFiles onChange={(s) => this.props.handleSelectChange('files', s)} value={this.props.doc.files} className={this.props.isValid(this.props.doc.files)
	                        ? 'is-valid'
	                        : 'is-invalid'}/>
	                <FormText color="muted">
	                    Upload the file to publish from your computer, and specify its language. It is best to publish one file per record, however you can add more if needed. To see Standards and Naming Conventions click
	                    <a href="https://drive.google.com/open?id=1TxOek13c4uoYAQWqsYBhjppeYUwHZK7nhx5qgm1FALA"> here</a>.
	                </FormText>
	                <div className="invalid-feedback">
	                    You must add at least one file
	                </div>
	            </FormGroup>
			</div>

			<div className="col-md-6">
	            <FormGroup className="required">
	                <Label for="spaces">Operation(s) / Webspace(s)</Label>
	                <HRInfoSelect type="spaces" isMulti={true} onChange={(s) => this.props.handleSelectChange('spaces', s)} value={this.props.doc.spaces} className={this.props.isValid(this.props.doc.spaces)
	                        ? 'is-valid'
	                        : 'is-invalid'}/>
	                <FormText color="muted">
	                    Click on the field and select where to publish the {this.props.label + ' '}
	                    (operation, regional site or thematic site).
	                </FormText>
	                <div className="invalid-feedback">
	                    You must select an operation or a space
	                </div>
	            </FormGroup>

	            {bundles}
	            {offices}
	            {disasters}

	            <FormGroup className="required">
	                <Label for="organizations">Organization(s)</Label>
	                <HRInfoAsyncSelect type="organizations" onChange={(s) => this.props.handleSelectChange('organizations', s)} value={this.props.doc.organizations} className={this.props.isValid(this.props.doc.organizations)
	                        ? 'is-valid'
	                        : 'is-invalid'}/>
	                <FormText color="muted">
	                    Type in and select the source(s) of the {this.props.label}.
	                </FormText>
	                <div className="invalid-feedback">
	                    You must select at least one organization
	                </div>
	            </FormGroup>

	            {/* Hidden under 'Add More Information' button

				*/}
			</div>

			<div className="col-md-12 my-3">
				<div className="row justify-content-center">
					<Button outline color="primary" onClick={this.toggle}>More Information</Button>
				</div>
			</div>
			<Collapse isOpen={this.state.collapse}>
				<div className="row">
					<div className="col-md-6">
						<FormGroup>
							<Label for="locations">Locations</Label>
							<HRInfoLocations onChange={(s) => this.props.handleSelectChange('locations', s)} value={this.props.doc.locations} isMulti="isMulti"/>
							<FormText color="muted">
								Select from the menu the country(ies) the {this.props.label + ' '}
								is about and indicate more specific locations by selecting multiple layers (region, province, town).
							</FormText>
						</FormGroup>

						<FormGroup>
							<Label for="themes">Theme(s)</Label>
							<HRInfoSelect type="themes" isMulti={true} onChange={(s) => this.props.handleSelectChange('themes', s)} value={this.props.doc.themes}/>
							<FormText color="muted">
								Click on the field and select all relevant themes. Choose only themes the {this.props.label}
								substantively refers to.
							</FormText>
						</FormGroup>
					</div>
					<div className="col-md-6">
						<FormGroup>
							<Label for="related_content">Related Content</Label>
							<RelatedContent onChange={(s) => this.props.handleSelectChange('related_content', s)} value={this.props.doc.related_content}/>
							<FormText color="muted">
								Add links to content that is related to the {this.props.label}
								you are publishing (example: language versions of the same {this.props.label}, or the link of the event the meeting minutes refer to) by indicating the title of the content and its url.
							</FormText>
						</FormGroup>
					</div>
				</div>
        	</Collapse>

            {
                this.props.status !== 'submitting' &&
					<span className="mx-auto my-3">
                        <Button color="primary">Publish</Button>
                        &nbsp;
                        <Button color="secondary" onClick={(evt) => this.props.handleSubmit(evt, 1)}>Save as Draft</Button>
                        &nbsp;
                    </span>
            }
            {(this.props.status === 'submitting' || this.props.status === 'deleting') && <FontAwesomeIcon icon={faSpinner} pulse="pulse" fixedWidth="fixedWidth"/>}
            {(this.props.match.params.id && this.props.status !== 'deleting') && <Button color="danger" onClick={this.props.handleDelete}>Delete</Button>}
        </Form>);
    }
}

export default DocumentForm;
