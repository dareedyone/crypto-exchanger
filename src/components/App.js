import React, { useEffect } from "react";
import "./App.css";
import {
	loadAccount,
	loadExchange,
	loadToken,
	loadWeb3,
} from "../store/interactions";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import Content from "./Content";

const App = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		(async function loadBlockchain() {
			try {
				const web3 = loadWeb3(dispatch);
				const network = await web3.eth.net.getNetworkType();
				const networkId = await web3.eth.net.getId();
				await loadAccount(dispatch, web3);
				await loadToken(dispatch, web3, networkId);
				await loadExchange(dispatch, web3, networkId);
				// const totalSupply = await token.methods.totalSupply().call();
				// console.log("totalSupply", totalSupply);
				console.log("the network", network);
			} catch (error) {
				window.alert(error.message);
			}
		})();
	}, [dispatch]);

	const account = useSelector((state) => state?.web3?.account);
	const areContractsLoaded = useSelector(
		(state) => state?.token?.loaded && state?.exchange?.loaded
	);

	console.log("contracts loaded", areContractsLoaded);

	return (
		<div>
			<Navbar account={account} />
			{areContractsLoaded ? <Content /> : <div className="content"></div>}
		</div>
	);
};

export default App;
