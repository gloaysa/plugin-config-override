import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { IConfigFile } from '@models/config-file.interface';

interface IConfigCheckboxes {
	configFiles: IConfigFile[];
	savingOverride: boolean;
	handleCheckbox: (configFile: IConfigFile, checked: boolean) => void;
}

const ConfigCheckboxesComponent: FunctionComponent<IConfigCheckboxes> = ({
	configFiles,
	savingOverride,
	handleCheckbox,
}) => {
	return (
		<Box>
			<FormGroup className="configuration-override__form-group">
				{configFiles?.map((configFile, index) => (
					<FormControlLabel
						disabled={savingOverride}
						onChange={({ target }) => handleCheckbox(configFile, (target as any).checked)}
						className="form-group__checkbox"
						key={index}
						control={<Checkbox checked={configFile.override} />}
						label={configFile.name}
					/>
				))}
			</FormGroup>
		</Box>
	);
};

export default ConfigCheckboxesComponent;
