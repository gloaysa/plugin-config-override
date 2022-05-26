import React, { FunctionComponent } from 'react';
import { Box, styled, Tab, Tabs } from '@mui/material';
import './tabs.component.css';

interface StyledTabProps {
	label: string;
	className?: string;
	hidden?: boolean;
}

interface TabsComponentProps {
	currentTab: number;
	setCurrentTab: (tabNumber: number) => void;
	tabs?: { name: string; hidden?: boolean }[];
	variant?: 'scrollable' | 'standard' | 'fullWidth';
}

const AntTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme, hidden }) => ({
	textTransform: 'none',
	minWidth: 0,
	[theme.breakpoints.up('sm')]: {
		minWidth: 0,
	},
	fontWeight: theme.typography.fontWeightRegular,
	marginRight: theme.spacing(1),
	color: 'rgba(0, 0, 0, 0.85)',
	display: hidden ? 'none' : 'flex',
}));

const TabsComponent: FunctionComponent<TabsComponentProps> = ({ currentTab, setCurrentTab, tabs, variant }) => {
	return (
		<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
			<Tabs
				variant={variant ? variant : 'scrollable'}
				scrollButtons="auto"
				value={currentTab}
				onChange={(event, newValue) => setCurrentTab(newValue)}
			>
				{tabs?.map((tab, index) => (
					<AntTab key={index} label={tab.name} hidden={tab.hidden} />
				))}
			</Tabs>
		</Box>
	);
};

export default TabsComponent;
