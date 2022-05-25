import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import './configuration-override.css';
import { Box, Typography } from '@mui/material';
import TabsComponent from '@components/tabs/tabs.component';
import TabPanelComponent from '@components/tab-panel/tab-panel.component';
import { IConfigFile } from '@models/config-file.interface';
import { ConfigFilesService } from '@services/config-files.service';
import ConfigCheckboxesComponent from '@components/config-checkboxes/config-checkboxes.component';
import TopBarComponent from '@components/top-bar/top-bar.component';
import ModalComponent from '@components/modal/modal.component';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ConfigurationOverrideComponent = () => {
	const configFilesService: ConfigFilesService = ConfigFilesService.getInstance();
	const [currentTab, setCurrentTab] = useState<number>(0);
	const [configFiles, setConfigFiles] = useState<IConfigFile[]>([]);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
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

	const handleCheckbox = (configName: IConfigFile, checked: boolean) => {
		savingOverride = true;
		configFilesService.storeFileOverride(configName, checked).then((configFiles) => {
			setConfigFiles(configFiles);
			savingOverride = false;
		});
	};

	const onGetConfigsFromServer = () => {
		setModalOpen(true);
	};

	const handleGetConfigurations = () => {
		setModalOpen(false);
		chrome.tabs.query({ active: true, currentWindow: true }, async (arrayOfTabs) => {
			if (arrayOfTabs[0].id) {
				await configFilesService.setOverrideMode(true);
				await chrome.tabs.reload(arrayOfTabs[0].id);
			}
		});
	};

	return (
		<Box className="configuration-override">
			<TopBarComponent
				onGetConfigsFromServer={onGetConfigsFromServer}
				onCreateNewFile={() => handleChangeTab(configFiles.length)}
			/>
			<ConfigCheckboxesComponent
				handleCheckbox={handleCheckbox}
				configFiles={configFiles}
				savingOverride={savingOverride}
			></ConfigCheckboxesComponent>
			<Typography>Below you can add and edit configuration files</Typography>
			<TabsComponent currentTab={currentTab} setCurrentTab={handleChangeTab} configFiles={configFiles} />
			<TabPanelComponent
				onSaveExistingFile={saveExistingFile}
				onCreateNewFile={saveNewFile}
				onRemoveFile={removeFile}
				configFile={configFiles[currentTab]}
				index={currentTab}
			/>

			<footer className="configuration-override__footer">
				<Box>
					<Typography align="center">
						Made with <FavoriteIcon color="error" fontSize="small" /> by Guillermo Loaysa
					</Typography>
				</Box>
			</footer>
			<ModalComponent
				title="Get configurations from server"
				body="Are you sure? This will refresh the page, get the configurations as they are in the server and load them overriding your files in the extension."
				open={modalOpen}
				handleClose={() => setModalOpen(false)}
				handleAccept={handleGetConfigurations}
			/>
		</Box>
	);
};

render(<ConfigurationOverrideComponent />, document.querySelector('#mock-panel'));
