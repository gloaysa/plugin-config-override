import React, { FunctionComponent } from 'react';
import { Box, Typography } from '@mui/material';
import AccordionComponent from '@components/accordion/accordion.component';

const styles = {
	paragraph: {
		marginTop: '20px',
	},
};

const HowToFilesComponent: FunctionComponent = () => {
	return (
		<Box>
			<AccordionComponent title="How to use the files">
				<Typography style={styles.paragraph}>Below you can edit configuration files.</Typography>
				<Typography style={styles.paragraph}>
					The JSON editor will mark errors with a red box at the left of the error.
				</Typography>
				<Typography style={styles.paragraph}>
					Fix your errors, if any, before saving the file to avoid strange behavior.
				</Typography>
				<Typography style={styles.paragraph}>Remember to save the file if you make changes to it!</Typography>
				<h2>
					More features
				</h2>
				<Typography style={styles.paragraph}>
					If you want the response of a configuration to be null, just add to the file: &#123;"null": true&#125;
				</Typography>
				<Typography style={styles.paragraph}>
					If you want to completely remove the configuration from the response, just add to the file: &#123;"undefined": true&#125;
				</Typography>
			</AccordionComponent>
		</Box>
	);
};

export default HowToFilesComponent;
