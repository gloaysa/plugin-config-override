import React, { FunctionComponent } from 'react';
import { Box, Button, Typography } from '@mui/material';
import emptyPNG from '@images/empty.png';

interface InitialTemplateComponent {
	handleGoToNewFile: () => void;
	onGetConfigsFromServer: () => void;
}

const styles = {
	paragraph: {
		marginTop: '10px',
	},
};

const InitialTemplateComponent: FunctionComponent<InitialTemplateComponent> = ({
	handleGoToNewFile,
	onGetConfigsFromServer,
}) => {
	return (
		<Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<Typography>Hey! It looks like you don't have any file saved yet.</Typography>
			<img src={emptyPNG} alt="By flat**** from Pngtree.com" />
			<Box>
				<Typography>You can add a new file by clicking the button below or through the top left menu.</Typography>
				<Typography style={styles.paragraph}>
					If you want to load the configuration files from the server, you can do so from (you guessed it) the button
					below or from the top left menu.
				</Typography>
				<Typography style={styles.paragraph}>
					You can use this utility to load the configurations from the top left menu every time that you want to start
					fresh and get the newest configurations for your environment, but please remember that loading files that way
					will override the existing files that you may have in this extension.
				</Typography>
			</Box>
			<Box style={{ marginTop: '20px', display: 'flex', width: '100%', justifyContent: 'space-between' }}>
				<Button color="primary" variant="contained" onClick={handleGoToNewFile}>
					Create new configuration file
				</Button>
				<Button color="primary" variant="contained" onClick={onGetConfigsFromServer}>
					Get Configurations from server
				</Button>
			</Box>
		</Box>
	);
};

export default InitialTemplateComponent;
