import React, { FunctionComponent } from 'react';
import { Box, styled, Tab, Tabs } from '@mui/material';
import { IConfigFile } from '@models/config-file.interface';
import './tabs.component.css'

interface StyledTabProps {
	label: string;
	className?: string;
}

interface TabsComponentProps {
	currentTab: number;
	setCurrentTab: (tabNumber: number) => void;
	configFiles?: IConfigFile[];
}

const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
	textTransform: 'none',
	minWidth: 0,
	[theme.breakpoints.up('sm')]: {
		minWidth: 0,
	},
	fontWeight: theme.typography.fontWeightRegular,
	marginRight: theme.spacing(1),
	color: 'rgba(0, 0, 0, 0.85)',
}));

const TabsComponent: FunctionComponent<TabsComponentProps> = ({ currentTab, setCurrentTab, configFiles }) => {
	return (
		<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
			<Tabs
				variant="scrollable"
				scrollButtons="auto"
				value={currentTab}
				onChange={(event, newValue) => setCurrentTab(newValue)}
			>
				{configFiles?.map((configFile, index) => (
					<AntTab key={index} label={configFile.name} />
				))}
				<AntTab className='tab--new-file' label='Add new config file'/>
			</Tabs>
		</Box>
	);
};

export default TabsComponent;
