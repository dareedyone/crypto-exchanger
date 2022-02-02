import {
	WEB3_LOADED,
	WEB3_ACCOUNT_LOADED,
	TOKEN_LOADED,
	EXCHANGE_LOADED,
	CANCELLED_ORDERS_LOADED,
	FILLED_ORDERS_LOADED,
	ALL_ORDERS_LOADED,
} from "./types";
// WEB3
export const web3Loaded = (connection) => ({
	type: WEB3_LOADED,
	connection,
});

export const web3AccountLoaded = (account) => ({
	type: WEB3_ACCOUNT_LOADED,
	account,
});

// TOKEN

export const tokenLoaded = (contract) => ({
	type: TOKEN_LOADED,
	contract,
});

// EXCHANGE

export const exchangeLoaded = (contract) => ({
	type: EXCHANGE_LOADED,
	contract,
});

export const cancelledOrdersLoaded = (cancelledOrders) => ({
	type: CANCELLED_ORDERS_LOADED,
	cancelledOrders,
});

export const filledOrdersLoaded = (filledOrders) => ({
	type: FILLED_ORDERS_LOADED,
	filledOrders,
});
export const allOrdersLoaded = (allOrders) => ({
	type: ALL_ORDERS_LOADED,
	allOrders,
});
