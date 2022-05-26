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
import InitialTemplateComponent from './initial-template/initial-template.component';
import HowToFilesComponent from './how-to-files/how-to-files.component';
import HowToConfigComponent from './how-to-config/how-to-config.component';

enum TabIndex {
	Configs = 0,
	Files = 1,
	NewFile = 2,
}

interface TabInit {
	name: string;
	index: number;
	hidden?: boolean;
}

const tabs: TabInit[] = [
	{
		name: 'Select configs',
		index: TabIndex.Configs,
	},
	{
		name: 'JSON Files',
		index: TabIndex.Files,
	},
	{
		name: 'Add new file',
		index: TabIndex.NewFile,
		hidden: true,
	},
];

const ConfigurationOverrideComponent = () => {
	const configFilesService: ConfigFilesService = ConfigFilesService.getInstance();
	const [currentTab, setCurrentTab] = useState<number>(0);
	const [configFiles, setConfigFiles] = useState<IConfigFile[]>([]);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [filesTabNumber, setFilesTabNumber] = useState<number>(0);
	let savingOverride = false;

	useEffect(() => {
		configFilesService.getAllConfigFiles().then((files) => {
			setConfigFiles(files);
			configFilesService.onConfigChanges((filesChanged) => {
				setConfigFiles(filesChanged);
			});
		});
	}, [configFilesService, setConfigFiles]);

	useEffect(() => {
		configFilesService.setOverrideMode(false);
	}, [configFilesService, configFiles]);

	const handleChangeTab = (newTab: number) => {
		setCurrentTab(newTab);
	};

	const handleGoToFileFromConfig = (pageNumber: number) => {
		setCurrentTab(TabIndex.Files);
		setFilesTabNumber(pageNumber);
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
			callback(allFiles);
			tabs[TabIndex.NewFile].hidden = true;
			setCurrentTab(TabIndex.Files);
			setFilesTabNumber(0);
		});
	};

	const removeFile = (file: IConfigFile, callback: (files: IConfigFile[]) => void) => {
		configFilesService.removeConfigFile(file).then((allFiles) => {
			callback(allFiles);
		});
	};

	const handleGoToNewFile = () => {
		tabs[TabIndex.NewFile].hidden = false;
		setCurrentTab(TabIndex.NewFile);
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

				<TabComponent value={currentTab} index={TabIndex.Configs}>
					{!configFiles.length ? (
						<InitialTemplateComponent
							onGetConfigsFromServer={onGetConfigsFromServer}
							handleGoToNewFile={handleGoToNewFile}
						/>
					) : (
						<Box>
							<HowToConfigComponent />

							<ConfigCheckboxesComponent
								handleCheckbox={handleCheckbox}
								configFiles={configFiles}
								savingOverride={savingOverride}
								onGoToFile={handleGoToFileFromConfig}
							></ConfigCheckboxesComponent>
						</Box>
					)}
				</TabComponent>

				<TabComponent value={currentTab} index={TabIndex.Files}>
					<Box>
						{!configFiles?.length ? (
							<InitialTemplateComponent
								onGetConfigsFromServer={onGetConfigsFromServer}
								handleGoToNewFile={handleGoToNewFile}
							/>
						) : (
							<Box>
								<HowToFilesComponent />

								<ConfigFilesComponent
									onSaveNewFile={saveNewFile}
									onSaveExistingFile={saveExistingFile}
									onRemoveFile={removeFile}
									configurationFiles={configFiles}
									tabNumber={filesTabNumber}
								/>
							</Box>
						)}
					</Box>
				</TabComponent>

				<TabComponent value={currentTab} index={TabIndex.NewFile}>
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
				open={modalOpen}
				handleClose={() => setModalOpen(false)}
				handleAccept={handleGetConfigurations}
			>
				<Typography>
					Are you sure? This will refresh the page, get the configurations as they are in the server and load them
					overriding your files in the extension.
				</Typography>
				<Typography style={{ marginTop: '20px' }}>
					Please don't use your browser until the page has finished loading.
				</Typography>
			</ModalComponent>
		</Box>
	);
};

render(<ConfigurationOverrideComponent />, document.querySelector('#mock-panel'));
