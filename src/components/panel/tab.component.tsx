import React, { FunctionComponent } from 'react';
import { Box } from '@mui/material';

interface ITabComponent {
	value: number;
	index: number;
}

const TabComponent: FunctionComponent<ITabComponent> = ({ children, value, index, ...other }) => {
	return (
		<Box
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Box>{children}</Box>
				</Box>
			)}
		</Box>
	);
};

export default TabComponent;
