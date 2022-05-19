import React, { FunctionComponent, useState } from 'react';
import JsonEditorComponent from '@components/json-editor/json-editor.component';
import { IConfigFile } from '@models/config-file.interface';
import { Box, Button } from '@mui/material';

interface TabPanelProps {
	index: number;
	configFile?: IConfigFile;
	onSaveFile: (newConfigFile: IConfigFile) => void;
	onRemoveFile: (fileToRemove: IConfigFile) => void;
}

const TabPanelComponent: FunctionComponent<TabPanelProps> = ({ configFile, onSaveFile, onRemoveFile }) => {
	const [editedFile, setEditedFile] = useState<Record<string, any> | undefined>(configFile?.file);
	const [newFile, setNewFile] = useState<IConfigFile | undefined>(configFile);

	const handleOnChange = (changedFile: IConfigFile) => {
		setEditedFile(changedFile);
		if (!configFile) {
			setNewFile(changedFile);
		}
	};

	const handleSaveEditFile = () => {
		if (configFile && editedFile) {
			configFile.file = editedFile;
			onSaveFile(configFile);
		}
	}

	const handleSaveNewFile = () => {
		if (newFile) {
			onSaveFile(newFile);
		}
	};

	return (
		<Box>
			<JsonEditorComponent configFile={configFile} onChange={handleOnChange} />
			{!configFile && (
				<Button disabled={!editedFile} onClick={handleSaveNewFile}>
					Save new file
				</Button>
			)}
			{configFile && (
				<>
					<Button onClick={() => onRemoveFile(configFile)}>Remove the file {configFile.name}</Button>
					<Button disabled={!editedFile} onClick={handleSaveEditFile}>Save changes for {configFile.name}</Button>
				</>
			)}
		</Box>
	);
};

export default TabPanelComponent;
