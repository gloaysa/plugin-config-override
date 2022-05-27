import React, { FunctionComponent, useState } from 'react';
import JsonEditorComponent from '@components/json-editor/json-editor.component';
import { IConfigFile } from '@models/config-file.interface';
import { Box, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface IFilePanelComponent {
	index: number;
	configFile?: IConfigFile;
	onSaveExistingFile: (editedConfigFile: IConfigFile) => void;
	onCreateNewFile: (newConfigFile: IConfigFile) => void;
	onRemoveFile: (fileToRemove: IConfigFile) => void;
}

const NFilePanelComponent: FunctionComponent<IFilePanelComponent> = ({
	configFile,
	onSaveExistingFile,
	onRemoveFile,
	onCreateNewFile,
}) => {
	const [editedFile, setEditedFile] = useState<Record<string, any> | undefined>(configFile?.file);
	const [newFile, setNewFile] = useState<IConfigFile | undefined>(configFile);
	const [fileHasChanged, setFileHasChanged] = useState<boolean>(false);

	const handleOnChange = (changedFile: IConfigFile) => {
		setEditedFile(changedFile);
		setFileHasChanged(true);
		if (!configFile) {
			setNewFile(changedFile);
		}
	};

	const handleSaveEditFile = () => {
		if (configFile && editedFile) {
			configFile.file = editedFile;
			onSaveExistingFile(configFile);
			setFileHasChanged(false);
		}
	};

	const handleSaveNewFile = () => {
		if (newFile) {
			onCreateNewFile(newFile);
		}
	};

	return (
		<Box>
			<JsonEditorComponent configFile={configFile} onChange={handleOnChange} />
			<Box style={{ display: 'flex', margin: '20px 0' }}>
				{!configFile && (
					<Button color="primary" variant="contained" disabled={!fileHasChanged} onClick={handleSaveNewFile}>
						Save new file
					</Button>
				)}
				{configFile && (
					<Box style={{ display: 'flex', width: '100%' }}>
						<Button disabled={!fileHasChanged} variant="contained" color="success" onClick={handleSaveEditFile}>
							Save
						</Button>
						<IconButton
							color="error"
							aria-label="delete"
							style={{ marginLeft: 'auto' }}
							onClick={() => onRemoveFile(configFile)}
						>
							<DeleteIcon />
						</IconButton>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default NFilePanelComponent;
