const CTHU = artifacts.require("BaseToken");
const SOULS = artifacts.require("Souls");
const SOULHARVEST = artifacts.require("SoulsHarvest");

contract("SoulHarvester", accounts => {

    let deployedCTHU;
    let deployedSOULS;
    let deployedSOULHARVEST;

    // should have enough Souls after deployment (msg.sender)
    let accountWithSouls = accounts[0];

    before(async () => {
        // init contracts
        deployedSOULS = await SOULS.new();
        deployedCTHU = await CTHU.new("cthu", "cthu", "18", "20000000000000000000000000", "10000000000000000000000000", true, false);
        deployedSOULHARVEST = await SOULHARVEST.new(deployedCTHU.address, deployedSOULS.address);

        // give soulharvest contract some chtu tokens
        await deployedCTHU.transfer.sendTransaction(deployedSOULHARVEST.address, (1 * (10 ** 18)).toString());
    })

    it("allow to see balanace of chtu token to user", () => {
        //chtu balanceOf
    });

    it("allow  to see  balance of staked souls token to user", () => {
        //souls balanceOf
    });





    it("allows to exchange 1 CHTU Token for 100 Souls Token", async () => {

        // check balances before buy action
        const balanceBeforeSwapSouls = await deployedSOULS.balanceOf.call(accountWithSouls);
        const balanceBeforeSwapChtu = await deployedCTHU.balanceOf.call(accountWithSouls);

        // approve soul harvest to spend 100 tokens
        await deployedSOULS.approve.sendTransaction(deployedSOULHARVEST.address, (100 * (10 ** 18)).toString(), { from: accountWithSouls });

        // buy 1 chtu for 100 soul tokens
        await deployedSOULHARVEST.buy.sendTransaction((100 * (10 ** 18)).toString(), { from: accountWithSouls });

        // check balances
        const balanceAfterSwapSouls = await deployedSOULS.balanceOf.call(accountWithSouls);
        const balanceAfterSwapChtu = await deployedCTHU.balanceOf.call(accountWithSouls);

        // assertions
        assert.equal((100 * (10 ** 18)).toString(), balanceBeforeSwapSouls.sub(balanceAfterSwapSouls).toString(), "New balance of Souls not properly calculated");
        assert.equal((1 * (10 ** 18)).toString(), balanceAfterSwapChtu.sub(balanceBeforeSwapChtu).toString(), "New balance of CHTU not properly calculated");
    })
})