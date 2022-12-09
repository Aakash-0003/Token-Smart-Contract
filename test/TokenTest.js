const Token = artifacts.require("Token");

contract('Token', function (accounts) {
    it("Contract's deployed", async () => {
        const instance = await Token.deployed();
        console.log(instance.address);
        assert(instance.address !== '');
    });
    it("Contract's Initialiazation matches",
        async () => {
            const instance = await Token.deployed();
            const name = await instance.name.call();
            const symbol = await instance.symbol.call();
            const decimals = await instance.decimals.call();
            const totalSupply = await instance.totalSupply.call();
            const ownerBalance = await instance.balanceOf.call(accounts[0]);
            console.log(ownerBalance.valueOf().toNumber());
            assert.equal("Streax", name.valueOf(), "UNMATCHED INFO");
            assert.equal("STX", symbol.valueOf(), "UNMATCHED INFO");
            assert.equal(10, decimals.valueOf(), "UNMATCHED INFO");
            assert.equal(50000000000000, totalSupply.valueOf(), "UNMATCHED INFO");
            assert.equal(50000000000000, ownerBalance.valueOf(), "UNMATCHED INFO");
        });
    it("Successfull Transfer", async () => {
        const instance = await Token.deployed();
        const accountOne = accounts[0];
        const accountTwo = accounts[1];
        const beforeTransferOne = (await instance.balanceOf.call(accountOne)).toNumber();
        const beforeTransferTwo = (await instance.balanceOf.call(accountTwo)).toNumber();

        const amount = 300000000;

        await instance.transfer(accountTwo, amount, { from: accountOne });

        const afterTransferOne = (await instance.balanceOf.call(accountOne)).toNumber();
        const afterTransferTwo = (await instance.balanceOf.call(accountTwo)).toNumber();
        console.log(beforeTransferOne, beforeTransferTwo, afterTransferOne, afterTransferTwo);
        assert.equal(afterTransferTwo, beforeTransferTwo + amount, "Transfer Unsuccessfull");
        assert.equal(afterTransferOne, beforeTransferOne - amount, "Transfer Unsuccessfull");
    });
    it("Successfull Approval to Spender and checking Allowance ", async () => {
        const instance = await Token.deployed();
        const accountOne = accounts[0];
        const accountTwo = accounts[1];

        const amount = 500000000;
        await instance.approve(accountTwo, amount, { from: accountOne });

        const allowance = (await instance.allowance.call(accountOne, accountTwo)).toNumber();
        assert.equal(allowance, amount, "Transfer Unsuccessfull");
    });
    it("Successfull Approval to increment allowance for spender ", async () => {
        const instance = await Token.deployed();
        const owner = accounts[0];
        const spender = accounts[1];
        const prevAllowance = (await instance.allowance.call(owner, spender)).toNumber();
        const amount = 700000000;
        await instance.increaseAllowance(spender, amount, { from: owner });

        const updatedAllowance = (await instance.allowance.call(owner, spender)).toNumber();
        assert.equal(updatedAllowance, prevAllowance + amount, "Transfer Unsuccessfull");
    });
    it("Successfull Approval to Decrease allowance for spender ", async () => {
        const instance = await Token.deployed();
        const owner = accounts[0];
        const spender = accounts[1];
        const prevAllowance = (await instance.allowance.call(owner, spender)).toNumber();
        const amount = 700000000;
        await instance.decreaseAllowance(spender, amount, { from: owner });

        const updatedAllowance = (await instance.allowance.call(owner, spender)).toNumber();
        assert.equal(updatedAllowance, prevAllowance - amount, "Transfer Unsuccessfull");
    });
    it("Successfull TransferFrom to address by spender", async () => {
        const instance = await Token.deployed();
        const from = accounts[0];
        const spender = accounts[1]
        const to = accounts[2];
        const beforeAllowance = (await instance.allowance.call(from, spender)).toNumber();
        const ownerBeforeBalance = (await instance.balanceOf.call(from)).toNumber();
        const recipientBeforeBalance = (await instance.balanceOf.call(to)).toNumber();

        const amount = 60000;

        await instance.transferFrom(from, to, amount, { from: spender });

        const afterAllowance = (await instance.allowance.call(from, spender)).toNumber();
        const ownerAfterBalance = (await instance.balanceOf.call(from)).toNumber();
        const recipientAfterBalance = (await instance.balanceOf.call(to)).toNumber();

        assert.equal(beforeAllowance - amount, afterAllowance, "Transfer Unsuccessfull");
        assert.equal(ownerAfterBalance, ownerBeforeBalance - amount, "Transfer Unsuccessfull");
        assert.equal(recipientAfterBalance, recipientBeforeBalance + amount, "Transfer Unsuccessfull");
    });
});