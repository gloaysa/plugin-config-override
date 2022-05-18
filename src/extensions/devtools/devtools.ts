let extPanelWindow: { addEventListener: (arg0: string, arg1: (event: any) => void) => void } | null = null;

chrome.devtools.panels.create(
	'ONEShop Config Override',
	'./assets/images/icon-50.png',
	'../apps/configuration-override/index.html',
	(panel) => {
		panel.onShown.addListener(pinTab);
	}
);

let debuggerInstance: any = null;
function setupDebugger(target: chrome.tabs.Tab) {
	debuggerInstance = { tabId: target.id };

	chrome.debugger.attach(debuggerInstance, '1.0', () => {
		chrome.debugger.sendCommand(debuggerInstance, 'Fetch.enable', { patterns: [{ urlPattern: '*' }] });
	});
}

function setupActions() {
	extPanelWindow?.addEventListener('message', (event) => {
		if (event.source !== extPanelWindow) {
			return;
		}
		let message = event.data;
		if (message && message.source !== 'override-debug') {
			return;
		}
		switch (message.action) {
			case 'start': {
				startOverride();
				break;
			}
			case 'stop': {
				destroyDebugger();
			}
		}
	});
}

function startOverride() {
	let queryOptions = { active: true, currentWindow: true };
	chrome.tabs.query(queryOptions, (tab) => {
		setupDebugger(tab[0]);
	});
}
function pinTab(panelWindow: any) {
	extPanelWindow = panelWindow;
	setupActions();
}
function destroyDebugger() {
	chrome.debugger.detach(debuggerInstance);
}
