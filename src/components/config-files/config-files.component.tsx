import React, { FunctionComponent, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import TabsComponent from '@components/tabs/tabs.component';
import TabPanelComponent from '@components/tab-panel/tab-panel.component';
import { IConfigFile } from '@models/config-file.interface';

interface IConfigFilesComponent {
	configurationFiles: IConfigFile[];
	onSaveExistingFile: (file: IConfigFile, callback: (files: IConfigFile[]) => void) => void;
	onSaveNewFile: (file: IConfigFile, callback: (files: IConfigFile[]) => void) => void;
	onRemoveFile: (file: IConfigFile, callback: (files: IConfigFile[]) => void) => void;
	tabNumber?: number;
}

const ConfigFilesComponent: FunctionComponent<IConfigFilesComponent> = ({
	configurationFiles,
	onSaveExistingFile,
	onSaveNewFile,
	onRemoveFile,
	tabNumber = 0,
}) => {
	const [currentTab, setCurrentTab] = useState<number>(tabNumber);
	const [configFiles, setConfigFiles] = useState<IConfigFile[]>(configurationFiles);

	useEffect(() => {
		if (configurationFiles.length > configFiles.length) {
			setConfigFiles(configurationFiles);
		}
	}, [configurationFiles]);

	const saveExistingFile = (file: IConfigFile) => {
		onSaveExistingFile(file, (files) => {
			setConfigFiles(files);
		});
	};

	const saveNewFile = (file: IConfigFile) => {
		onSaveNewFile(file, () => {});
	};

	const removeFile = (file: IConfigFile) => {
		onRemoveFile(file, (files) => {
			setCurrentTab(currentTab ? currentTab - 1 : currentTab);
			setConfigFiles(files);
		});
	};

	const handleChangeTab = (newTab: number) => {
		setCurrentTab(newTab);
	};

	return (
		<Box>
			<TabsComponent currentTab={currentTab} setCurrentTab={handleChangeTab} tabs={configFiles} />
			<TabPanelComponent
				onSaveExistingFile={saveExistingFile}
				onCreateNewFile={saveNewFile}
				onRemoveFile={removeFile}
				configFile={configFiles[currentTab]}
				index={currentTab}
			/>
		</Box>
	);
};

export default ConfigFilesComponent;
