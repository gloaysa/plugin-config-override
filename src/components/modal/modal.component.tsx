import React, { FunctionComponent } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';

interface IModalComponent {
	title: string;
	body: string;
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

const ModalComponent: FunctionComponent<IModalComponent> = ({ title, body, open, handleClose, handleAccept }) => {
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
				<Typography id="modal-modal-description" sx={{ mt: 2 }}>
					{body}
				</Typography>

				<Box style={style.buttons}>
					<Button color="primary" onClick={handleAccept}>
						Accept
					</Button>
					<Button color="error" onClick={handleClose}>
						NOPE
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default ModalComponent;
