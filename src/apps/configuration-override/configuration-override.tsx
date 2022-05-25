import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import './configuration-override.css';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';

import TabsComponent from '@components/tabs/tabs.component';
import TabPanelComponent from '@components/tab-panel/tab-panel.component';
import { IConfigFile } from '@models/config-file.interface';
import { ConfigFilesService } from '@services/config-files.service';

const ConfigurationOverrideComponent = () => {
	const configFilesService: ConfigFilesService = ConfigFilesService.getInstance();
	const [currentTab, setCurrentTab] = useState<number>(0);
	const [configFiles, setConfigFiles] = useState<IConfigFile[]>([]);
	let savingOverride = false;

	useEffect(() => {
		configFilesService.getAllConfigFiles().then((files) => {
			setConfigFiles(files);
			configFilesService.onConfigChanges((filesChanged) => setConfigFiles(filesChanged));
		});
	}, [configFilesService, setConfigFiles]);

	useEffect(() => {
		configFilesService.setOverrideMode(false);
	}, [configFilesService, configFiles]);

	const saveExistingFile = (file: IConfigFile) => {
		configFilesService.storeConfigFile(file);
	};

	const saveNewFile = (file: IConfigFile) => {
		configFilesService.storeConfigFile(file).then((allFiles) => {
			setCurrentTab(allFiles.length - 1);
		});
	};

	const removeFile = (file: IConfigFile) => {
		configFilesService.removeConfigFile(file).then(() => {
			setCurrentTab(currentTab ? currentTab - 1 : currentTab);
		});
	};

	const handleChangeTab = (newTab: number) => {
		setCurrentTab(newTab);
	};

	const handleCheckbox = (configName: IConfigFile, event: any) => {
		savingOverride = true;
		configFilesService.storeFileOverride(configName, event.checked).then((configFiles) => {
			setConfigFiles(configFiles);
			savingOverride = false;
		});
	};

	const handleGetConfigurations = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, async (arrayOfTabs) => {
			if (arrayOfTabs[0].id) {
				await configFilesService.setOverrideMode(true);
				await chrome.tabs.reload(arrayOfTabs[0].id);
			}
		});
	};

	return (
		<Box className="configuration-override">
			<Box>
				<Typography>Select the configurations that you want to override</Typography>
				<FormGroup className="configuration-override__form-group">
					{configFiles?.map((configFile, index) => (
						<FormControlLabel
							disabled={savingOverride}
							onChange={({ target }) => handleCheckbox(configFile, target)}
							className="form-group__checkbox"
							key={index}
							control={<Checkbox checked={configFile.override} />}
							label={configFile.name}
						/>
					))}
				</FormGroup>
			</Box>
			<Typography>Below you can add and edit configuration files</Typography>
			<TabsComponent currentTab={currentTab} setCurrentTab={handleChangeTab} configFiles={configFiles} />
			<TabPanelComponent
				onSaveExistingFile={saveExistingFile}
				onCreateNewFile={saveNewFile}
				onRemoveFile={removeFile}
				configFile={configFiles[currentTab]}
				index={currentTab}
			/>
			<Button onClick={handleGetConfigurations}>Get configurations from server</Button>

			<footer className="configuration-override__footer">
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
