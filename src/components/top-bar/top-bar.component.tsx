import React, { FunctionComponent } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuComponent from '@components/top-bar/menu/menu.component';

interface ITopBarComponent {
	onCreateNewFile: () => void;
	onGetConfigsFromServer: () => void;
}

const TopBarComponent: FunctionComponent<ITopBarComponent> = ({ onCreateNewFile, onGetConfigsFromServer }) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
						aria-controls={open ? 'demo-positioned-menu' : undefined}
						aria-haspopup="true"
						aria-expanded={open ? 'true' : undefined}
						onClick={handleClick}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Configuration Override
					</Typography>
				</Toolbar>
			</AppBar>
			<MenuComponent
				onCreateNewFile={onCreateNewFile}
				onGetConfigsFromServer={onGetConfigsFromServer}
				open={open}
				anchorEl={anchorEl}
				handleClose={handleClose}
			/>
		</Box>
	);
};

export default TopBarComponent;
