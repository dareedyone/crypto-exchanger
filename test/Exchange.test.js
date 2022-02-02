const { tokens, EVM_REVERT, ETHER_ADDRESS, ether } = require("./helpers");
require("chai").use(require("chai-as-promised")).should();
const Exchange = artifacts.require("./Exchange");
const Token = artifacts.require("./Token");

contract("Exchange", ([deployer, feeAccount, user1, user2]) => {
	let token;
	let exchange;
	const feePercent = 10;
	beforeEach(async () => {
		// Deploy token
		token = await Token.new();

		// transfer some tokens to user1
		token.transfer(user1, tokens(100), { from: deployer });

		// deploy exchange
		exchange = await Exchange.new(feeAccount, feePercent);
	});
	describe("deployment", () => {
		it("tracks the fee account", async () => {
			const result = await exchange.feeAccount();
			result.should.equal(feeAccount);
		});
		it("tracks the fee percent", async () => {
			const result = await exchange.feePercent();
			result.toString().should.equal(feePercent.toString());
		});
	});
	describe("fallback", () => {
		it("reverts when Ether is sent directly", async () => {
			await exchange
				.sendTransaction({
					value: 1, // 1 wei or any amount
					from: user1,
				})
				.should.be.rejectedWith(EVM_REVERT);
		});
	});
	describe("depositing Ether", async () => {
		let result;
		const amount = ether(1);
		beforeEach(async () => {
			result = await exchange.depositEther({ from: user1, value: amount });
		});

		it("tracks the Ether deposit", async () => {
			const balance = await exchange.tokens(ETHER_ADDRESS, user1);
			balance.toString().should.equal(amount.toString());
		});
		it("emits a Deposit event", async () => {
			const log = result.logs[0];
			log.event.should.equal("Deposit");
			const event = log.args;
			event.token
				.toString()
				.should.equal(ETHER_ADDRESS, "ether address is correct");
			event.user.toString().should.equal(user1, "user address is correct");
			event.amount
				.toString()
				.should.equal(amount.toString(), "amount is correct");
			event.balance
				.toString()
				.should.equal(amount.toString(), "balance is correct");
		});
	});
	describe("withdrawing Ether", () => {
		const amount = ether(1);
		let result;

		beforeEach(async () => {
			// Deposit Ether first
			await exchange.depositEther({ from: user1, value: amount });
		});

		describe("success", () => {
			beforeEach(async () => {
				// Withdraw Ether
				result = await exchange.withdrawEther(amount, { from: user1 });
			});

			it("withdraws Ether funds", async () => {
				const balance = await exchange.tokens(ETHER_ADDRESS, user1);
				balance.toString().should.equal("0");
			});
			it("emits a Withdraw event", async () => {
				const log = result.logs[0];
				log.event.should.equal("Withdraw");
				const event = log.args;
				event.token
					.toString()
					.should.equal(ETHER_ADDRESS, "token address is correct");
				event.user.toString().should.equal(user1, "user address is correct");
				event.amount
					.toString()
					.should.equal(amount.toString(), "amount is correct");
				event.balance.toString().should.equal("0", "balance is correct");
			});
		});

		describe("failure", () => {
			it("rejects withdraws for insufficient balances", async () => {
				await exchange
					.withdrawEther(ether(100), { from: user1 })
					.should.be.rejectedWith(EVM_REVERT);
			});
		});
	});
	describe("depositing tokens", () => {
		let result;
		const amount = tokens(10);

		describe("success", () => {
			beforeEach(async () => {
				await token.approve(exchange.address, amount, { from: user1 });
				result = await exchange.depositToken(token.address, amount, {
					from: user1,
				});
			});
			it("tracks the token deposited", async () => {
				// check exchange token balance
				let balance;
				balance = await token.balanceOf(exchange.address);
				balance.toString().should.equal(amount.toString());

				// check tokens on exchange
				balance = await exchange.tokens(token.address, user1);
				balance.toString().should.equal(amount.toString());
			});
			it("emits a Deposit event", async () => {
				const log = result.logs[0];
				log.event.should.equal("Deposit");
				const event = log.args;
				event.token
					.toString()
					.should.equal(token.address, "token address is correct");
				event.user.toString().should.equal(user1, "user address is correct");
				event.amount
					.toString()
					.should.equal(amount.toString(), "amount is correct");
				event.balance
					.toString()
					.should.equal(amount.toString(), "balance is correct");
			});
		});
		describe("failure", () => {
			it("rejects Ether deposits", async () => {
				await exchange
					.depositToken(ETHER_ADDRESS, amount, { from: user1 })
					.should.be.rejectedWith(EVM_REVERT);
			});
			it("fails when no tokens are approved", async () => {
				// Don't approve any tokens before depositing
				await exchange
					.depositToken(token.address, amount, { from: user1 })
					.should.be.rejectedWith(EVM_REVERT);
			});
		});
	});
	describe("withdrawing tokens", () => {
		let result;
		const amount = tokens(10);

		describe("success", () => {
			beforeEach(async () => {
				// Deposit tokens first
				await token.approve(exchange.address, amount, { from: user1 });
				await exchange.depositToken(token.address, amount, {
					from: user1,
				});
				// withdraw tokens
				result = await exchange.withdrawToken(token.address, amount, {
					from: user1,
				});
			});
			it("withdraw token funds", async () => {
				// check exchange token balance

				const balance = await exchange.tokens(token.address, user1);
				balance.toString().should.equal("0");
			});
			it("emits a Withdraw event", async () => {
				const log = result.logs[0];
				log.event.should.eq("Withdraw");
				const event = log.args;
				event.token
					.toString()
					.should.equal(token.address, "token address is correct");
				event.user.toString().should.equal(user1, "user address is correct");
				event.amount
					.toString()
					.should.equal(amount.toString(), "amount is correct");
				event.balance.toString().should.equal("0", "balance is correct");
			});
		});
		describe("failure", () => {
			it("rejects Ether withdraws", async () => {
				await exchange
					.withdrawToken(ETHER_ADDRESS, amount, { from: user1 })
					.should.be.rejectedWith(EVM_REVERT);
			});
			it("fails insufficient balances", async () => {
				// Attempt to withdraw tokens without depositing any first
				await exchange
					.withdrawToken(token.address, amount, { from: user1 })
					.should.be.rejectedWith(EVM_REVERT);
			});
		});
	});

	describe("checking balances", () => {
		beforeEach(async () => {
			await exchange.depositEther({ from: user1, value: ether(1) });
		});

		it("returns user balance", async () => {
			const result = await exchange.balanceOf(ETHER_ADDRESS, user1);
			result.toString().should.equal(ether(1).toString());
		});
	});
	describe("making orders", () => {
		let result;

		beforeEach(async () => {
			result = await exchange.makeOrder(
				token.address,
				tokens(1),
				ETHER_ADDRESS,
				ether(1),
				{ from: user1 }
			);
		});
		it("tracks the newly created order", async () => {
			const orderCount = await exchange.orderCount();
			orderCount.toString().should.equal(orderCount.toString());
			const order = await exchange.orders(orderCount);
			order.id.toString().should.equal(orderCount.toString(), "id is correct");
			order.user.should.equal(user1, "user is correct");
			order.tokenGet.should.equal(token.address, "tokenGet is correct");
			order.amountGet
				.toString()
				.should.equal(tokens(1).toString(), "amountGet is correct");
			order.tokenGive.should.equal(ETHER_ADDRESS, "tokenGive is correct");
			order.amountGive
				.toString()
				.should.equal(ether(1).toString(), "amountGive is correct");
		});
		it("emits an 'Order' event", async () => {
			const log = result.logs[0];
			log.event.should.eq("Order");
			const event = log.args;
			event.id.toString().should.equal("1", "id is correct");
			event.user.should.equal(user1, "user is correct");
			event.tokenGet.should.equal(token.address, "tokenGet is correct");
			event.amountGet
				.toString()
				.should.equal(tokens(1).toString(), "amountGet is correct");
			event.tokenGive.should.equal(ETHER_ADDRESS, "tokenGive is correct");
			event.amountGive
				.toString()
				.should.equal(ether(1).toString(), "amountGive is correct");
			event.timestamp
				.toString()
				.length.should.be.at.least(1, "timestamp is present");
		});
	});
	describe("order actions", () => {
		beforeEach(async () => {
			// user1 deposits ether only
			await exchange.depositEther({ from: user1, value: ether(1) });

			// give token to user2
			await token.transfer(user2, tokens(100), { from: deployer });

			// user2 deposits token only
			await token.approve(exchange.address, tokens(2), { from: user2 });
			await exchange.depositToken(token.address, tokens(2), { from: user2 });
			// user1 makes an order to buy token with ether
			await exchange.makeOrder(
				token.address,
				tokens(1),
				ETHER_ADDRESS,
				ether(1),
				{ from: user1 }
			);
		});

		describe("filling orders", () => {
			let result;

			describe("success", () => {
				beforeEach(async () => {
					// user2 fills order
					result = await exchange.fillOrder("1", { from: user2 });
				});

				it("executes the trade & charges fees", async () => {
					let balance;
					balance = await exchange.balanceOf(token.address, user1);
					balance
						.toString()
						.should.equal(tokens(1).toString(), "user1 received tokens");
					balance = await exchange.balanceOf(ETHER_ADDRESS, user2);
					balance
						.toString()
						.should.equal(ether(1).toString(), "user2 received ether");

					balance = await exchange.balanceOf(ETHER_ADDRESS, user1);
					balance.toString().should.equal("0", "user1 ether deducted");
					balance = await exchange.balanceOf(token.address, user2);
					balance
						.toString()
						.should.equal(
							tokens(0.9).toString(),
							"user2 tokens deducted with fee applied"
						);
					const feeAccount = await exchange.feeAccount();
					balance = await exchange.balanceOf(token.address, feeAccount);
					balance
						.toString()
						.should.equal(tokens(0.1).toString(), "feeAccount received fee");
				});

				it("updates filled orders", async () => {
					const orderFilled = await exchange.orderFilled(1);
					orderFilled.should.equal(true);
				});
				it('emits a "Trade" event', async () => {
					const log = result.logs[0];
					log.event.should.eq("Trade");
					const event = log.args;
					event.id.toString().should.equal("1", "id is correct");
					event.user.should.equal(user1, "user is correct");
					event.tokenGet.should.equal(token.address, "tokenGet is correct");
					event.amountGet
						.toString()
						.should.equal(tokens(1).toString(), "amountGet is correct");
					event.tokenGive.should.equal(ETHER_ADDRESS, "tokenGive is correct");
					event.amountGive
						.toString()
						.should.equal(ether(1).toString(), "amountGive is correct");
					event.userFill.should.equal(user2, "userFill is correct");
					event.timestamp
						.toString()
						.length.should.be.at.least(1, "timestamp is present");
				});
			});

			describe("failure", () => {
				it("rejects invalid order ids", async () => {
					const invalidOrderId = 9999;
					await exchange
						.fillOrder(invalidOrderId, { from: user2 })
						.should.be.rejectedWith(EVM_REVERT);
				});

				it("rejects already-filled orders", async () => {
					// fill the order
					await exchange.fillOrder("1", { from: user2 }).should.be.fulfilled;
					// try to filled again

					await exchange
						.fillOrder("1", { from: user2 })
						.should.be.rejectedWith(EVM_REVERT);
				});

				it("rejects cancelled orders", async () => {
					// cancel the order
					await exchange.cancelOrder("1", { from: user1 }).should.be.fulfilled;
					// try to fill the order

					await exchange
						.fillOrder("1", { from: user2 })
						.should.be.rejectedWith(EVM_REVERT);
				});
			});
		});

		describe("cancelling orders", () => {
			let result;

			describe("success", () => {
				beforeEach(async () => {
					result = await exchange.cancelOrder(1, { from: user1 });
				});
				it("updates cancelled orders", async () => {
					const orderCancelled = await exchange.orderCancelled(1);
					orderCancelled.should.equal(true);
				});
				it("emits an 'Cancel' event", async () => {
					const log = result.logs[0];
					log.event.should.eq("Cancel");
					const event = log.args;
					event.id.toString().should.equal("1", "id is correct");
					event.user.should.equal(user1, "user is correct");
					event.tokenGet.should.equal(token.address, "tokenGet is correct");
					event.amountGet
						.toString()
						.should.equal(tokens(1).toString(), "amountGet is correct");
					event.tokenGive.should.equal(ETHER_ADDRESS, "tokenGive is correct");
					event.amountGive
						.toString()
						.should.equal(ether(1).toString(), "amountGive is correct");
					event.timestamp
						.toString()
						.length.should.be.at.least(1, "timestamp is present");
				});
			});

			describe("failure", () => {
				it("rejects invalid order ids", async () => {
					const invalidOrderId = 99999;
					await exchange
						.cancelOrder(invalidOrderId, { from: user1 })
						.should.be.rejectedWith(EVM_REVERT);
				});

				it("rejects unauthorized cancellations", async () => {
					// Try to cancel order from other user
					await exchange
						.cancelOrder(1, { from: user2 })
						.should.be.rejectedWith(EVM_REVERT);
				});
			});
		});
	});
	// describe("fillOrder()", () => {
	// 	describe("Check balances after filling user1 buy Tokens order", () => {
	// 		beforeEach(async () => {
	// 			// user1 deposit 1 ETHER to the exchange
	// 			await exchange.depositEther({ from: user1, value: ether(1) });
	// 			// user1 create order to buy 10 tokens for 1 ETHER
	// 			await exchange.makeOrder(
	// 				token.address,
	// 				tokens(10),
	// 				ETHER_ADDRESS,
	// 				ether(1),
	// 				{ from: user1 }
	// 			);
	// 			// user2 gets tokens
	// 			await token.transfer(user2, tokens(11), { from: deployer });
	// 			// user2 approve exchange to spend his tokens
	// 			await token.approve(exchange.address, tokens(11), { from: user2 });
	// 			// user2 deposit tokens + fee cost (1 token) to the exchange
	// 			await exchange.depositToken(token.address, tokens(11), { from: user2 });
	// 			// user2 fills the order
	// 			await exchange.fillOrder("1", { from: user2 });
	// 		});

	// 		it("user1 tokens balance on exchange should eq. 10", async () => {
	// 			await (await exchange.balanceOf(token.address, user1))
	// 				.toString()
	// 				.should.eq(tokens(10).toString());
	// 		});

	// 		it("user1 ether balance on exchange should eq. 0", async () => {
	// 			await (await exchange.balanceOf(ETHER_ADDRESS, user1))
	// 				.toString()
	// 				.should.eq("0");
	// 		});

	// 		it("user2 tokens balance on exchange should eq. 0", async () => {
	// 			await (await exchange.balanceOf(token.address, user2))
	// 				.toString()
	// 				.should.eq("0");
	// 		});

	// 		it("user2 ether balance on exchange should eq. 1", async () => {
	// 			await (await exchange.balanceOf(ETHER_ADDRESS, user2))
	// 				.toString()
	// 				.should.eq(ether(1).toString());
	// 		});
	// 	});

	// 	describe("Check balances after filling user1 buy Ether order", () => {
	// 		beforeEach(async () => {
	// 			// User1 Gets the 10 tokens
	// 			await token.transfer(user1, tokens(10), { from: deployer });
	// 			// user1 approve exchange to spend his tokens
	// 			await token.approve(exchange.address, tokens(10), { from: user1 });
	// 			// user1 approve send tokens to the exchange
	// 			await exchange.depositToken(token.address, tokens(10), { from: user1 });
	// 			// user1 create order to buy 1 Ether for 10 tokens
	// 			await exchange.makeOrder(
	// 				ETHER_ADDRESS,
	// 				ether(1),
	// 				token.address,
	// 				tokens(10),
	// 				{ from: user1 }
	// 			);
	// 			// user2 deposit 1 ETHER + fee cost (.1 ETH) to the exchange
	// 			await exchange.depositEther({ from: user2, value: ether(1.1) });
	// 			// user2 fills the order
	// 			await exchange.fillOrder("1", { from: user2 });
	// 		});

	// 		it("user1 tokens balance on exchange should eq. 0", async () => {
	// 			await (await exchange.balanceOf(token.address, user1))
	// 				.toString()
	// 				.should.eq("0");
	// 		});

	// 		it("user1 Ether balance on exchange should eq. 1", async () => {
	// 			await (await exchange.balanceOf(ETHER_ADDRESS, user1))
	// 				.toString()
	// 				.should.eq(ether(1).toString());
	// 		});

	// 		it("user2 tokens balance on exchange should eq. 10", async () => {
	// 			await (await exchange.balanceOf(token.address, user2))
	// 				.toString()
	// 				.should.eq(tokens(10).toString());
	// 		});

	// 		it("user2 ether balance on exchange should eq. 0", async () => {
	// 			await (await exchange.balanceOf(ETHER_ADDRESS, user2))
	// 				.toString()
	// 				.should.eq("0");
	// 		});
	// 	});
	// });
});
