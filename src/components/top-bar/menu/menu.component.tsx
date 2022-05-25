import React, { FunctionComponent } from 'react';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';

import { ListItemIcon, ListItemText, Menu, MenuList } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';

interface IMenuComponent {
	open: boolean;
	handleClose: () => void;
	anchorEl: Element | ((element: Element) => Element) | null | undefined;
	onCreateNewFile: () => void;
	onGetConfigsFromServer: () => void;
}

const MenuComponent: FunctionComponent<IMenuComponent> = ({
	open,
	handleClose,
	anchorEl,
	onCreateNewFile,
	onGetConfigsFromServer,
}) => {
	const handleSelection = (selection: string) => {
		handleClose();
		switch (selection) {
			case 'new':
				return onCreateNewFile();
			case 'getConfigs':
				return onGetConfigsFromServer();
			default:
				break;
		}
	};

	return (
		<Paper sx={{ width: 320, maxWidth: '100%' }}>
			<Menu
				id="demo-positioned-menu"
				aria-labelledby="demo-positioned-button"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
			>
				<MenuList>
					<MenuItem className="menu-item" onClick={() => handleSelection('new')}>
						<ListItemIcon>
							<AddIcon fontSize="small" />
						</ListItemIcon>
						<ListItemText>Create new file</ListItemText>
					</MenuItem>
					<MenuItem onClick={() => handleSelection('getConfigs')}>
						<ListItemIcon>
							<WarningIcon fontSize="small" />
						</ListItemIcon>
						<ListItemText>Get configurations from server</ListItemText>
					</MenuItem>
				</MenuList>
			</Menu>
		</Paper>
	);
};

export default MenuComponent;
