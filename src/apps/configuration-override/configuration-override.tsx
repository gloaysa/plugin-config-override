import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Box, Typography } from '@mui/material';

import TabsComponent from '@components/tabs/tabs.component';
import TabPanelComponent from '@components/tab-panel/tab-panel.component';
import { IConfigFile } from '@models/config-file.interface';
import { ConfigFilesService } from '@services/config-files.service';

const ConfigurationOverrideComponent = () => {
	const configFilesService: ConfigFilesService = ConfigFilesService.getInstance();
	const [currentTab, setCurrentTab] = useState<number>(0);
	const [configFiles, setConfigFiles] = useState<IConfigFile[] | undefined>(undefined);
	const [currentFile, setCurrentFile] = useState<IConfigFile | undefined>(undefined);

	useEffect(() => {
		configFilesService.getAllConfigFiles().then((files) => {
			setConfigFiles(files);
			setCurrentFile(files[currentTab]);
		});
	}, [configFilesService, setConfigFiles]);

	const storeFile = (file: IConfigFile) => {
		configFilesService.storeConfigFile(file).then((allFiles) => setConfigFiles(allFiles));
	};

	const removeFile = (file: IConfigFile) => {
		configFilesService.removeConfigFile(file).then((allFiles) => setConfigFiles(allFiles));
	};

	const handleChangeTab = (newTab: number) => {
		setCurrentTab(newTab);
		setCurrentFile(configFiles && configFiles[newTab]);
	};

	return (
		<Box>
			<TabsComponent currentTab={currentTab} setCurrentTab={handleChangeTab} configFiles={configFiles} />
			<TabPanelComponent
				onSaveNewFile={storeFile}
				onRemoveFile={removeFile}
				configFile={currentFile}
				index={currentTab}
				onChange={storeFile}
			/>

			<footer style={{ color: 'gray', position: 'fixed', bottom: 0 }}>
				<Box>
					<Typography align="center">
						Made with <span style={{ color: 'red' }}>&hearts;</span> by Guillermo Loaysa
					</Typography>
				</Box>
			</footer>
		</Box>
	);
};

render(<ConfigurationOverrideComponent />, document.querySelector('#mock-panel'));
