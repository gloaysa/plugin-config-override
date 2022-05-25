export interface IConfigFile {
	name: string;
	file: Record<string, any>;
	mapValue?: string;
	override?: boolean;
}
