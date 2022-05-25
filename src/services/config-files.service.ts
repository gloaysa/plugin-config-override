import { IConfigFile } from '@models/config-file.interface';
import { IChromeStorage } from '@models/chrome-storage.interface';

export class ConfigFilesService {
	private static instance: ConfigFilesService;

	static getInstance() {
		if (!this.instance) {
			this.instance = new ConfigFilesService();
		}
		return this.instance;
	}

	getOverrideMode(): Promise<boolean> {
		return new Promise((resolve) => {
			chrome.storage.local.get(['overrideMode'], ({ overrideMode }) => {
				resolve(overrideMode);
			});
		});
	}

	async setOverrideMode(override: boolean) {
		const storageObject: IChromeStorage = {
			overrideMode: override,
		};
		await chrome.storage.local.set(storageObject);
	}

	public async storeFileOverride(configFile: IConfigFile, override: boolean): Promise<IConfigFile[]> {
		const currentConfigFiles = await this.getAllConfigFiles();
		const newConfigFiles = currentConfigFiles.map((existingFile) => {
			if (existingFile.name === configFile.name) {
				existingFile.override = override;
				return existingFile;
			}
			return existingFile;
		});
		const storageObject: IChromeStorage = {
			configurations: [...newConfigFiles],
		};
		await chrome.storage.local.set(storageObject);
		return storageObject.configurations || [];
	}

	public async storeConfigFile(file: IConfigFile): Promise<IConfigFile[]> {
		let newConfigFiles: IConfigFile[];
		const currentFiles = await this.getAllConfigFiles();
		if (currentFiles.some(({ name }) => name === file.name)) {
			newConfigFiles = currentFiles.map((existingFile) => {
				if (existingFile.name === file.name) {
					return file;
				}
				return existingFile;
			});
		} else {
			file.override = false;
			newConfigFiles = [...currentFiles, file];
		}

		const storageObject: IChromeStorage = {
			configurations: newConfigFiles,
		};
		await chrome.storage.local.set(storageObject);
		return newConfigFiles;
	}

	public removeConfigFile(fileToRemove: IConfigFile): Promise<IConfigFile[]> {
		return new Promise(async (resolve) => {
			const currentFiles = await this.getAllConfigFiles();
			const filteredConfigFiles = currentFiles?.filter((file) => file.name !== fileToRemove.name);
			const storageObject: IChromeStorage = {
				configurations: filteredConfigFiles,
			};
			chrome.storage.local.set(storageObject, () => {
				resolve(filteredConfigFiles);
			});
		});
	}

	public getAllConfigFiles(): Promise<IConfigFile[]> {
		return new Promise((resolve) => {
			chrome.storage.local.get(['configurations'], ({ configurations }) => {
				resolve(configurations?.length ? configurations : []);
			});
		});
	}

	async filterConfigurationsFromObject(filter: Record<any, string>): Promise<IConfigFile[] | undefined> {
		const configurations = await this.getAllConfigFiles();
		const filteredConfigurations = configurations?.filter((config: IConfigFile) => {
			return Object.entries(filter).some(([mapValue, configRequested]) => {
				config.mapValue = mapValue.replace('configName', 'getConfiguration');
				return config.override && configRequested === config.name;
			});
		});
		return filteredConfigurations?.length ? filteredConfigurations : undefined;
	}

	onConfigChanges(callback: (configurations: IConfigFile[]) => void) {
		chrome.storage.onChanged.addListener(({ configurations }) => {
			if (configurations) {
				callback(configurations.newValue);
			}
		})
	}
}
