const CTHU = artifacts.require("BaseToken");
const SOULS = artifacts.require("Souls");

contract("Souls", (accounts) => {

    let deployedCTHU;
    let deployedSOULS;

    // should have enough Souls after deployment (msg.sender)
    const accountWithSoulsAndCthu = accounts[0];

    before(async () => {
        // init contracts
        deployedSOULS = await SOULS.new();
        deployedCTHU = await CTHU.new("cthu", "cthu", "18", "20000000000000000000000000", "10000000000000000000000000", true, false);
        await deployedSOULS.setCthuAddress.sendTransaction(deployedCTHU.address);
    })

    it("provides stake function which transfers souls to souls contract", async () => {
        const responseApprove = await deployedCTHU.approve.sendTransaction(deployedSOULS.address, "10000000000000000000000000");
        const responseStake = await deployedSOULS.stake.sendTransaction("10000000000000000000000000");
        const balanceOfUser = await deployedCTHU.balanceOf.call(accountWithSoulsAndCthu);
        assert.equal(balanceOfUser.toString(), "0");
    })

    it("provides staked chtu tokens in souls contract of specific address", async () => {
        const response = await deployedSOULS.getAddressStakeAmount.call(accountWithSoulsAndCthu);
        assert.equal(response.toString(), "10000000000000000000000000");
    })

    it("allows to withdraw staked chtu from souls contracts", async () => {
        const response = await deployedSOULS.withdraw.sendTransaction("10000000000000000000000000");
        const balanceOfUser = await deployedCTHU.balanceOf.call(accountWithSoulsAndCthu);
        assert.equal(balanceOfUser.toString(), "10000000000000000000000000");
    })

    it("provides the souls token balance of a specific address", async () => {
        const balanceOfUser = await deployedSOULS.balanceOf.call(accountWithSoulsAndCthu);
        assert.equal(balanceOfUser.toString(), "1000000000000000000000");
    })

    it("provides function which returns available rewards balance", async () => {
        // generate some blocks
        await web3.eth.sendTransaction({ to: accounts[1], from: accounts[0] })
        await web3.eth.sendTransaction({ to: accounts[1], from: accounts[0] })
        await web3.eth.sendTransaction({ to: accounts[1], from: accounts[0] })
        await web3.eth.sendTransaction({ to: accounts[1], from: accounts[0] })

        // get actual rewards available
        const balanceOfUser = await deployedSOULS.myRewardsBalance.call(accountWithSoulsAndCthu);
        assert.notEqual(balanceOfUser.toString(), "0"); // why this returns 0?
    })

    it("provides getReward function which transfers souls to msg sender", async () => {
        const balanceOfUserPreGetReward = await deployedSOULS.balanceOf.call(accountWithSoulsAndCthu);
        await deployedSOULS.getReward.sendTransaction();
        const balanceOfUserPostGetReward = await deployedSOULS.balanceOf.call(accountWithSoulsAndCthu);
        assert.notEqual(balanceOfUserPreGetReward.toString(), balanceOfUserPostGetReward.toString());
    })

})

