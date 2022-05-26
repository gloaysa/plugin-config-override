import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import './configuration-override.css';
import { Box, Typography } from '@mui/material';
import { IConfigFile } from '@models/config-file.interface';
import { ConfigFilesService } from '@services/config-files.service';
import ConfigCheckboxesComponent from '@components/config-checkboxes/config-checkboxes.component';
import TopBarComponent from '@components/top-bar/top-bar.component';
import ModalComponent from '@components/modal/modal.component';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ConfigFilesComponent from '@components/config-files/config-files.component';
import TabsComponent from '@components/tabs/tabs.component';
import TabComponent from '@components/panel/tab.component';

const tabs = [
	{
		name: 'Select configs',
	},
	{
		name: 'JSON Files',
	},
	{
		name: 'Add new file',
		hidden: true,
	},
];

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

	const saveExistingFile = (file: IConfigFile, callback: (files: IConfigFile[]) => void) => {
		configFilesService.storeConfigFile(file).then((allFiles) => callback(allFiles));
	};

	const saveNewFile = (file: IConfigFile, callback: (files: IConfigFile[]) => void) => {
		configFilesService.storeConfigFile(file).then((allFiles) => {
			setCurrentTab(1);
			tabs[2].hidden = true;
			callback(allFiles);
		});
	};

	const removeFile = (file: IConfigFile, callback: (files: IConfigFile[]) => void) => {
		configFilesService.removeConfigFile(file).then((allFiles) => {
			callback(allFiles);
		});
	};

	const handleGoToNewFile = () => {
		tabs[2].hidden = false;
		setCurrentTab(2);
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
			<Box className="configuration-override__body">
				<TopBarComponent onGetConfigsFromServer={onGetConfigsFromServer} onCreateNewFile={() => handleGoToNewFile()} />
				<TabsComponent variant="fullWidth" currentTab={currentTab} setCurrentTab={handleChangeTab} tabs={tabs} />

				<TabComponent value={currentTab} index={0}>
					<Box>
						<Typography>Select the configurations that you want to override</Typography>
						<ConfigCheckboxesComponent
							handleCheckbox={handleCheckbox}
							configFiles={configFiles}
							savingOverride={savingOverride}
						></ConfigCheckboxesComponent>
					</Box>
				</TabComponent>

				<TabComponent value={currentTab} index={1}>
					<Box>
						<Typography>Below you can add and edit configuration files</Typography>
						<ConfigFilesComponent
							onSaveNewFile={saveNewFile}
							onSaveExistingFile={saveExistingFile}
							onRemoveFile={removeFile}
							configurationFiles={configFiles}
						/>
					</Box>
				</TabComponent>

				<TabComponent value={currentTab} index={2}>
					<Box>
						<Typography>Add a new file following the format</Typography>
						<ConfigFilesComponent
							onSaveNewFile={saveNewFile}
							onSaveExistingFile={saveExistingFile}
							onRemoveFile={removeFile}
							configurationFiles={[]}
						/>
					</Box>
				</TabComponent>
			</Box>

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
