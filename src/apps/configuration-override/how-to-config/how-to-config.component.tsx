import React, { FunctionComponent } from 'react';
import { Box, Typography } from '@mui/material';
import AccordionComponent from '@components/accordion/accordion.component';

const styles = {
	paragraph: {
		marginTop: '20px',
	},
};

const HowToConfigComponent: FunctionComponent = () => {
	return (
		<Box>
			<AccordionComponent title="How to use configurations">
				<Typography style={styles.paragraph}>
					Below you'll find a list of checkboxes that matches the configuration file names that you have stored.
				</Typography>
				<Typography style={styles.paragraph}>
					If you select one (or more configurations), their corresponding file content will replace the configurations
					that are coming from the server <strong>when you refresh the page</strong>, overriding them and sending them
					to your frontend.
				</Typography>
				<Typography style={styles.paragraph}>
					As a rule of thumb, only select here the configurations that you are currently working on or want to modify.
				</Typography>
				<Typography style={styles.paragraph}>
					If you don't select any configuration, nothing will be overriden and the frontend will received the configs as
					they are in the server.
				</Typography>
			</AccordionComponent>
		</Box>
	);
};

export default HowToConfigComponent;
