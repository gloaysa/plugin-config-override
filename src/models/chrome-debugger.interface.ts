interface Request {
	headers: Record<string, any>;
	initialPriority: 'High' | 'Low';
	method: 'OPTIONS' | 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT';
	referrerPolicy: string;
	url: string;
	postData: string;
}

export interface ConfigResponse {
	headers: { name: string; value: string }[];
	body: {
		data: Record<string, any>;
		errors?: Record<string, any>[];
	};
}

export interface EventParams {
	frameId: string;
	networkId: string;
	request: Request;
	requestId: string;
	resourceType: string;
}

export enum DebuggerFetch {
	requestPaused = 'Fetch.requestPaused',
	continueResponse = 'Fetch.continueResponse',
	fulfillRequest = 'Fetch.fulfillRequest',
	enable = 'Fetch.enable',
	getResponseBody = 'Fetch.getResponseBody',
}
