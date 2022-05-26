import React, { FunctionComponent } from 'react';
import './config-checkboxes.component.css';
import { Box, Checkbox, FormControlLabel, FormGroup, IconButton } from '@mui/material';
import { IConfigFile } from '@models/config-file.interface';
import LaunchIcon from '@mui/icons-material/Launch';

interface IConfigCheckboxes {
	configFiles: IConfigFile[];
	savingOverride: boolean;
	handleCheckbox: (configFile: IConfigFile, checked: boolean) => void;
	onGoToFile: (pageNumber: number) => void;
}

const ConfigCheckboxesComponent: FunctionComponent<IConfigCheckboxes> = ({
	configFiles,
	savingOverride,
	handleCheckbox,
	onGoToFile,
}) => {
	return (
		<Box>
			<FormGroup className="configuration-override__form-group">
				{configFiles?.map((configFile, index) => (
					<Box key={index} className="form-group__checkbox">
						<FormControlLabel
							disabled={savingOverride}
							onChange={({ target }) => handleCheckbox(configFile, (target as any).checked)}
							control={<Checkbox checked={configFile.override} />}
							label={configFile.name}
						/>
						<IconButton color="primary" onClick={() => onGoToFile(index)}>
							<LaunchIcon fontSize="small" />
						</IconButton>
					</Box>
				))}
			</FormGroup>
		</Box>
	);
};

export default ConfigCheckboxesComponent;
