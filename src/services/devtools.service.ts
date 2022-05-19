import ExtensionPanel = chrome.devtools.panels.ExtensionPanel;

export class DevtoolsService {
	private static instance: DevtoolsService;

	static getInstance() {
		if (!this.instance) {
			this.instance = new DevtoolsService();
		}
		return this.instance;
	}

	createPanel(tabName: string, pathToHtml: string): Promise<ExtensionPanel> {
		return new Promise((resolve) => {
			chrome.devtools.panels.create(tabName, './assets/images/icon-50.png', pathToHtml, (panel) => {
				resolve(panel);
			});
		});
	}
}
