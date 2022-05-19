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
		body[mapValue as string] = file;
	});
	return body;
};
