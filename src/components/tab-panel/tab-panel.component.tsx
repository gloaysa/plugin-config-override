import React, { FunctionComponent, useState } from 'react';
import JsonEditorComponent from '@components/json-editor/json-editor.component';
import { IConfigFile } from '@models/config-file.interface';
import { Box, Button } from '@mui/material';

interface TabPanelProps {
	index: number;
	configFile?: IConfigFile;
	onChange: (configFile: IConfigFile) => void;
	onSaveNewFile: (newConfigFile: IConfigFile) => void;
	onRemoveFile: (fileToRemove: IConfigFile) => void;
}

const TabPanelComponent: FunctionComponent<TabPanelProps> = ({ configFile, onChange, onSaveNewFile, onRemoveFile }) => {
	const [editedFile, setEditedFile] = useState<IConfigFile | undefined>(configFile);

	const handleOnChange = (changedFile: IConfigFile) => {
		setEditedFile(changedFile);
		if (configFile) {
			return onChange(changedFile);
		}
	};

	const handleSaveFile = () => {
		if (editedFile) {
			onSaveNewFile(editedFile);
		}
	};

	return (
		<Box>
			<JsonEditorComponent configFile={configFile} onChange={handleOnChange} />
			{!configFile && (
				<Button disabled={!editedFile} onClick={handleSaveFile}>
					Save new file
				</Button>
			)}
			{configFile && <Button onClick={() => onRemoveFile(configFile)}>Remove the file</Button>}
		</Box>
	);
};

export default TabPanelComponent;
