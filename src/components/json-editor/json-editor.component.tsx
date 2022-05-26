import React, { FunctionComponent, useEffect, useRef } from 'react';
import ace from 'brace';
import { JsonEditor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import 'brace/mode/json';
import 'brace/theme/github';
import { IConfigFile } from '@models/config-file.interface';

interface JsonEditorComponentProps {
	configFile?: IConfigFile;
	onChange: (configFile: IConfigFile) => void;
}

const JsonEditorComponent: FunctionComponent<JsonEditorComponentProps> = ({ configFile, onChange }) => {
	const jsonEditorRef = useRef<JsonEditor | null>(null);
	const newConfigFile: IConfigFile = {
		name: 'name of the file as it appears on `ubff?op=getConfigurations` call (e.g. billing-address-v1).',
		file: {
			replaceMe: 'replace the property and this text with the actual configuration.',
		},
	};

	useEffect(() => {
		if (jsonEditorRef.current !== null) {
			// @ts-ignore
			jsonEditorRef.current.set(configFile?.file ?? newConfigFile);
		}
	}, [configFile?.file]);

	const setRef = (instance: JsonEditor | null) => {
		if (instance) {
			jsonEditorRef.current = instance.jsonEditor;
		} else {
			jsonEditorRef.current = null;
		}
	};

	return (
		<JsonEditor
			ref={setRef}
			mode="code"
			ace={ace}
			theme="ace/theme/github"
			value={configFile?.file ?? newConfigFile}
			onChange={onChange}
			htmlElementProps={{ style: { height: '60vh' } }}
		/>
	);
};

export default JsonEditorComponent;
