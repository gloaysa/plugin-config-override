import React, { FunctionComponent } from 'react';
import { Box, Button, Divider, Modal, Typography } from '@mui/material';

interface IModalComponent {
	title: string;
	open: boolean;
	handleClose: () => void;
	handleAccept: () => void;
}

const style = {
	main: {
		position: 'absolute' as 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
	},
	buttons: {
		display: 'flex',
		justifyContent: 'space-between',
		marginTop: '20px',
	},
};

const ModalComponent: FunctionComponent<IModalComponent> = ({ title, open, handleClose, handleAccept, children }) => {
	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={style.main}>
				<Typography id="modal-modal-title" variant="h6" component="h2">
					{title}
				</Typography>

				<Divider />

				<Box style={{ marginTop: '20px' }}>{children}</Box>

				<Box style={style.buttons}>
					<Button color="primary" variant="contained" onClick={handleAccept}>
						Accept
					</Button>
					<Button color="error" variant="contained" onClick={handleClose}>
						NOPE
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default ModalComponent;
