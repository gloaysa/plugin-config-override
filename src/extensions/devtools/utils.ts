import { ConfigResponse } from '@models/chrome-debugger.interface';
import { IConfigFile } from '@models/config-file.interface';

export const getHeaderString = (headers: Headers): ConfigResponse['headers'] => {
	let responseHeader: ConfigResponse['headers'] = [];
	headers.forEach((value, name) => {
		responseHeader.push({ name, value });
	});
	return responseHeader;
};

export const replaceConfigurations = (
	body: Record<string, any>,
	configurations: IConfigFile[]
): Record<string, any> => {
	configurations.forEach(({ mapValue, file }) => {
		let newFile: Record<string, any> | null | undefined = file;
		if (file['undefined']) {
			newFile = undefined;
		}
		if (file['null']) {
			newFile = null;
		}
		body[mapValue as string] = newFile;
	});
	return body;
};

export const createConfigFileFromResponse = (
	configsRequested: Record<string, string>,
	configsReceived: Record<string, any>
): IConfigFile[] => {
	return Object.entries(configsRequested).map(
		([configMap, configName]): IConfigFile => {
			const mapValue = configMap.replace('configName', 'getConfiguration');
			return {
				name: configName,
				file: configsReceived[mapValue],
				mapValue: mapValue,
				override: false,
			};
		}
	).filter((configFile) => !!configFile.file)
		.sort((a, b) => a.name.localeCompare(b.name));
};
