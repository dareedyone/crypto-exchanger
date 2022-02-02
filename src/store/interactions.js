import Web3 from "web3";
import {
	web3Loaded,
	web3AccountLoaded,
	tokenLoaded,
	exchangeLoaded,
	cancelledOrdersLoaded,
	allOrdersLoaded,
	filledOrdersLoaded,
} from "./actions";
import Token from "../abis/Token.json";
import Exchange from "../abis/Exchange.json";
// WEB3
export const loadWeb3 = (dispatch) => {
	const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
	dispatch(web3Loaded(web3));
	return web3;
};

export const loadAccount = async (dispatch, web3) => {
	const accounts = await web3.eth.requestAccounts();
	const account = accounts[0];
	dispatch(web3AccountLoaded(account));
	return account;
};

// TOKEN

export const loadToken = async (dispatch, web3, networkId) => {
	try {
		const token = new web3.eth.Contract(
			Token.abi,
			Token.networks[networkId].address
		);
		dispatch(tokenLoaded(token));
		return token;
	} catch (error) {
		console.log("the error", error);
		throw error;
		// throw new Error(
		// 	"Token smart contract not deployed to the current network. Please select another network with Metamask."
		// );
	}
};

// EXCHANGE

export const loadExchange = async (dispatch, web3, networkId) => {
	try {
		const exchange = new web3.eth.Contract(
			Exchange.abi,
			Exchange.networks[networkId].address
		);
		dispatch(exchangeLoaded(exchange));
		return exchange;
	} catch (error) {
		console.log("the error", error);
		// define more explicit error later by checking coming error
		// throw new Error(
		// 	"Exchange smart contract not deployed to the current network. Please select another network with Metamask."
		// );
		throw error;
	}
};

export const loadAllOrders = async (dispatch, exchange) => {
	const cancelStream = await exchange.getPastEvents("Cancel", {
		fromBlock: 0,
		toBlock: "latest",
	});
	const cancelledOrders = cancelStream.map(
		(eventStream) => eventStream.returnValues
	);
	dispatch(cancelledOrdersLoaded(cancelledOrders));
	const tradeStream = await exchange.getPastEvents("Trade", {
		fromBlock: 0,
		toBlock: "latest",
	});
	const filledOrders = tradeStream.map(
		(eventStream) => eventStream.returnValues
	);
	dispatch(filledOrdersLoaded(filledOrders));

	const orderStream = await exchange.getPastEvents("Order", {
		fromBlock: 0,
		toBlock: "latest",
	});
	const allOrders = orderStream.map((eventStream) => eventStream.returnValues);
	dispatch(allOrdersLoaded(allOrders));
};
