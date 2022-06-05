import {
	WEB3_LOADED,
	WEB3_ACCOUNT_LOADED,
	TOKEN_LOADED,
	EXCHANGE_LOADED,
	CANCELLED_ORDERS_LOADED,
	FILLED_ORDERS_LOADED,
	ALL_ORDERS_LOADED,
	ORDER_CANCELLING,
	ORDER_CANCELLED,
	ORDER_FILLING,
	ORDER_FILLED,
	ETHER_BALANCE_LOADED,
	EXCHANGE_ETHER_BALANCE_LOADED,
	EXCHANGE_TOKEN_BALANCE_LOADED,
	BALANCES_LOADED,
	BALANCES_LOADING,
	ETHER_DEPOSIT_AMOUNT_CHANGED,
	ETHER_WITHDRAW_AMOUNT_CHANGED,
	TOKEN_DEPOSIT_AMOUNT_CHANGED,
	TOKEN_WITHDRAW_AMOUNT_CHANGED,
	TOKEN_BALANCE_LOADED,
	BUY_ORDER_AMOUNT_CHANGED,
	BUY_ORDER_PRICE_CHANGED,
	BUY_ORDER_MAKING,
	ORDER_MADE,
	SELL_ORDER_AMOUNT_CHANGED,
	SELL_ORDER_PRICE_CHANGED,
	SELL_ORDER_MAKING,
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

// CANCEL ORDER

export const orderCancelling = () => ({
	type: ORDER_CANCELLING,
});

export const orderCancelled = (order) => ({
	type: ORDER_CANCELLED,
	order,
});
// FILLED
export const orderFilling = () => ({
	type: ORDER_FILLING,
});
export const orderFilled = (order) => ({
	type: ORDER_FILLED,
	order,
});

// BALANCES
export const etherBalanceLoaded = (balance) => {
	return {
		type: ETHER_BALANCE_LOADED,
		balance,
	};
};

export const tokenBalanceLoaded = (balance) => {
	return {
		type: TOKEN_BALANCE_LOADED,
		balance,
	};
};

export const exchangeEtherBalanceLoaded = (balance) => {
	return {
		type: EXCHANGE_ETHER_BALANCE_LOADED,
		balance,
	};
};

export const exchangeTokenBalanceLoaded = (balance) => {
	return {
		type: EXCHANGE_TOKEN_BALANCE_LOADED,
		balance,
	};
};

export const balancesLoaded = () => {
	return {
		type: BALANCES_LOADED,
	};
};

export const balancesLoading = () => {
	return {
		type: BALANCES_LOADING,
	};
};

export const etherDepositAmountChanged = (amount) => {
	return {
		type: ETHER_DEPOSIT_AMOUNT_CHANGED,
		amount,
	};
};

export const etherWithdrawAmountChanged = (amount) => {
	return {
		type: ETHER_WITHDRAW_AMOUNT_CHANGED,
		amount,
	};
};

export const tokenDepositAmountChanged = (amount) => {
	return {
		type: TOKEN_DEPOSIT_AMOUNT_CHANGED,
		amount,
	};
};

export const tokenWithdrawAmountChanged = (amount) => {
	return {
		type: TOKEN_WITHDRAW_AMOUNT_CHANGED,
		amount,
	};
};

// Buy Order
export const buyOrderAmountChanged = (amount) => {
	return {
		type: BUY_ORDER_AMOUNT_CHANGED,
		amount,
	};
};

export const buyOrderPriceChanged = (price) => {
	return {
		type: BUY_ORDER_PRICE_CHANGED,
		price,
	};
};

export const buyOrderMaking = () => {
	return {
		type: BUY_ORDER_MAKING,
	};
};

// Generic Order
export const orderMade = (order) => {
	return {
		type: ORDER_MADE,
		order,
	};
};

// Sell Order
export const sellOrderAmountChanged = (amount) => {
	return {
		type: SELL_ORDER_AMOUNT_CHANGED,
		amount,
	};
};

export const sellOrderPriceChanged = (price) => {
	return {
		type: SELL_ORDER_PRICE_CHANGED,
		price,
	};
};

export const sellOrderMaking = () => {
	return {
		type: SELL_ORDER_MAKING,
	};
};
