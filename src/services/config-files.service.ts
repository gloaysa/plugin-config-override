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

	public storeConfigFile(file: IConfigFile): Promise<IConfigFile[]> {
		return new Promise(async (resolve) => {
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
				newConfigFiles = [...currentFiles, file];
			}

			const storageObject: IChromeStorage = {
				configurations: newConfigFiles,
			};
			chrome.storage.local.set(storageObject, () => {
				resolve(newConfigFiles);
			});
		});
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
}
