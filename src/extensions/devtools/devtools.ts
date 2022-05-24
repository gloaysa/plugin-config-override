import { DevtoolsService } from '@services/devtools.service';
import { DebuggerService } from '@services/debugger.service';
import { ConfigResponse, DebuggerFetch, EventParams } from '@models/chrome-debugger.interface';
import { ConfigFilesService } from '@services/config-files.service';
import { getHeaderString, replaceConfigurations } from './utils';
import ExtensionPanel = chrome.devtools.panels.ExtensionPanel;
import HttpHeader = chrome.webRequest.HttpHeader;
import WebResponseHeadersDetails = chrome.webRequest.WebResponseHeadersDetails;
import { WebRequestService } from '@services/web-request.service';

class Devtools {
	private static instance: Devtools;

	private devtoolsService: DevtoolsService;
	private debuggerService: DebuggerService;
	private webRequestService: WebRequestService;
	private configFilesService: ConfigFilesService;

	private debuggerInstance: chrome.debugger.Debuggee;

	private extPanelWindow: Window | undefined;
	private currentTab: chrome.tabs.Tab | undefined;

	private responseHeaders: HttpHeader[] | undefined;

	private debuggerAttached = false;

	static getInstance() {
		if (!this.instance) {
			this.instance = new Devtools();
		}
		return this.instance;
	}

	constructor() {
		this.devtoolsService = DevtoolsService.getInstance();
		this.debuggerService = DebuggerService.getInstance();
		this.webRequestService = WebRequestService.getInstance();
		this.configFilesService = ConfigFilesService.getInstance();
		this.debuggerInstance = {};
		this.devtoolsService
			.createPanel('ONEShop Config Override', '../apps/configuration-override/index.html')
			.then((panel) => this.startListenerWhenPanelOpen(panel));
	}

	startListenerWhenPanelOpen(panel: ExtensionPanel): void {
		panel.onShown.addListener(async (panelWindow) => {
			this.extPanelWindow = panelWindow;
			this.currentTab = await this.setCurrentTab();
			if (!this.debuggerAttached) {
				this.debuggerAttached = true;
				await this.createDebuggerInstance();
			}
		});
	}

	setCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
		return new Promise((resolve) => {
			let queryOptions = { active: true, currentWindow: true };
			chrome.tabs.query(queryOptions, (tab) => {
				if (this.currentTab?.id !== tab[0].id) {
					resolve(tab[0]);
				}
				resolve(this.currentTab);
			});
		});
	}

	async createDebuggerInstance() {
		this.debuggerInstance = { tabId: this.currentTab?.id };
		await this.debuggerService.attachDebuggerInstance(this.debuggerInstance);
		await this.debuggerService.enableFetch(this.debuggerInstance, {
			patterns: [{ urlPattern: '*/proxy/ubff?op=getConfigurations' }],
		});
		this.listenForCalls();
	}

	listenForCalls() {
		const setResponseHeaders = (details: WebResponseHeadersDetails) => {
			this.responseHeaders = details.responseHeaders;
			return { responseHeaders: this.responseHeaders };
		};

		this.debuggerService.onDetach(() => {
			this.debuggerAttached = false;
		});
		this.webRequestService.onHeadersReceived(
			setResponseHeaders,
			{
				tabId: this.currentTab?.id,
				urls: ['<all_urls>'],
			},
			['blocking', 'responseHeaders', 'extraHeaders']
		);

		this.debuggerService.onEvent(async (source, method, params) => {
			if (!params) {
				return;
			}
			const { requestId, request } = params;
			const commandParams: any = {
				requestId,
			};

			if (source.tabId === this.currentTab?.id) {
				if (method === DebuggerFetch.requestPaused && request.method !== 'OPTIONS') {
					await this.overrideAndSendNewResponse(request, commandParams);
				} else {
					await this.debuggerService.continueResponse(this.debuggerInstance, commandParams);
				}
			}
		});
	}

	async overrideAndSendNewResponse(request: EventParams['request'], commandParams: Record<string, any>) {
		const response = await this.getResponseBody(request);
		const { variables } = JSON.parse(request.postData);
		const { data } = response.body;

		const configurations = await this.configFilesService.filterConfigurationsFromObject(variables);

		if (!configurations) {
			return await this.debuggerService.continueResponse(this.debuggerInstance, commandParams);
		}

		response.body.data = replaceConfigurations(data, configurations);

		commandParams.responseCode = 200;
		commandParams.responseHeaders = this.responseHeaders;
		commandParams.body = btoa(unescape(encodeURIComponent(JSON.stringify(response.body))));

		await this.debuggerService.fulfillRequest(this.debuggerInstance, commandParams);
	}

	async getResponseBody(request: EventParams['request']): Promise<ConfigResponse> {
		const { url, method, headers, postData } = request;
		return fetch(url, {
			method,
			mode: 'cors',
			headers,
			redirect: 'follow',
			body: postData,
		}).then(
			async (response: Response): Promise<ConfigResponse> => {
				return {
					body: await response.json(),
					headers: getHeaderString(response.headers),
				};
			}
		);
	}

	destroyDebugger() {
		if (this.debuggerInstance) {
			this.debuggerService.detachDebuggerInstance(this.debuggerInstance);
		}
	}
}

Devtools.getInstance();
