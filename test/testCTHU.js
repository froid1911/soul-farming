const CTHU = artifacts.require("BaseToken");

contract("CTHU", (accounts) => {

    const accountWithCthuToken = accounts[0];
    const accountWithoutCthuToken = accounts[1];
    let deployedCTHU;

    before(async () => {
        deployedCTHU = await CTHU.new("cthu", "cthu", "18", "20000000000000000000000000", "10000000000000000000000000", true, false);
    })

    it("provides CHTU token balance of specific address", async () => {
        const response = await deployedCTHU.balanceOf.call(accountWithCthuToken);
        assert.equal(response.toString(), "10000000000000000000000000");
    })

    it("provides working approve and transfer function", async () => {
        await deployedCTHU.approve.sendTransaction(accountWithoutCthuToken, "10000000000000000000000000");
        await deployedCTHU.transferFrom.sendTransaction(accountWithCthuToken, accountWithoutCthuToken, "10000000000000000000000000", { from: accountWithoutCthuToken });
        const balanceOfAccount1 = await deployedCTHU.balanceOf.call(accountWithCthuToken);
        const balanceOfAccount2 = await deployedCTHU.balanceOf.call(accountWithoutCthuToken);
        assert.equal(balanceOfAccount1.toString(), "0");
        assert.equal(balanceOfAccount2.toString(), "10000000000000000000000000");
    })
})