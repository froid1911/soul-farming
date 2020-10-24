const CTHU = artifacts.require("BaseToken");
const SOULS = artifacts.require("Souls");

contract("Souls", (accounts) => {

    let deployedCTHU;
    let deployedSOULS;

    // should have enough Souls after deployment (msg.sender)
    const accountWithSoulsAndCthu = accounts[0];

    let initCthuTokenBalance;
    let soulsRewardsBalance;
    let soulsBalance;

    before(async () => {
        // init contracts
        deployedSOULS = await SOULS.new();
        deployedCTHU = await CTHU.new("cthu", "cthu", "18", "20000000000000000000000000", "10000000000000000000000000", true, false);
        await deployedSOULS.setCthuAddress.sendTransaction(deployedCTHU.address);

        initCthuTokenBalance = await deployedCTHU.balanceOf.call(accountWithSoulsAndCthu);
    })

    it("provides the souls token balance of a specific address", async () => {
        const balanceOfUser = await deployedSOULS.balanceOf.call(accountWithSoulsAndCthu);
        assert.equal(balanceOfUser.toString(), "1000000000000000000000");
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

    it("allows to generate rewards on each block", async () => {
        // generate some blocks and rewards

        // 10
        await web3.eth.sendTransaction({ to: accounts[1], from: accounts[0] })
        soulsRewardsBalance = await deployedSOULS.myRewardsBalance.call(accountWithSoulsAndCthu);
        assert.equal(soulsRewardsBalance.toString(), "100000000000000000000")

        // 20
        await web3.eth.sendTransaction({ to: accounts[1], from: accounts[0] })
        soulsRewardsBalance = await deployedSOULS.myRewardsBalance.call(accountWithSoulsAndCthu);
        assert.equal(soulsRewardsBalance.toString(), "200000000000000000000")

        // 30
        await web3.eth.sendTransaction({ to: accounts[1], from: accounts[0] })
        soulsRewardsBalance = await deployedSOULS.myRewardsBalance.call(accountWithSoulsAndCthu);
        assert.equal(soulsRewardsBalance.toString(), "300000000000000000000");
    })

    it("provides get reward function which returns farmed souls", async () => {
        // available rewards 30
        soulsRewardsBalance = await deployedSOULS.myRewardsBalance.call(accountWithSoulsAndCthu);
        assert.equal(soulsRewardsBalance.toString(), "300000000000000000000");

        // current souls balance 100
        soulsBalance = await deployedSOULS.balanceOf.call(accountWithSoulsAndCthu);
        assert.equal(soulsBalance.toString(), "1000000000000000000000")

        // get reward
        await deployedSOULS.getReward.sendTransaction();

        // new balance is 136  
        soulsBalance = await deployedSOULS.balanceOf.call(accountWithSoulsAndCthu);
        assert.equal(soulsBalance.toString(), "1360000000000000000000")

        await deployedSOULS.getReward.sendTransaction();
        soulsBalance = await deployedSOULS.balanceOf.call(accountWithSoulsAndCthu);
        assert.equal(soulsBalance.toString(), "1450000000000000000000")

        // call  get reward second time new Balance 145
        await deployedSOULS.getReward.sendTransaction();
        soulsBalance = await deployedSOULS.balanceOf.call(accountWithSoulsAndCthu);
        assert.equal(soulsBalance.toString(), "1540000000000000000000")
    })

    it("allows to withdraw once which unstakes cthu and harvest rewards", async () => {
        // generate reward
        await web3.eth.sendTransaction({ to: accounts[1], from: accounts[0] })

        // get balances before withdraw
        const rewardsBalance = await deployedSOULS.myRewardsBalance.call(accountWithSoulsAndCthu);
        const stakedBalance = await deployedSOULS.getAddressStakeAmount.call(accountWithSoulsAndCthu);

        // withdraw
        await deployedSOULS.withdraw.sendTransaction(initCthuTokenBalance.toString());

        // get balances after withdraw
        const newBalance = await deployedCTHU.balanceOf.call(accountWithSoulsAndCthu);
        const newSoulsBalance = await deployedSOULS.balanceOf.call(accountWithSoulsAndCthu);
        const newStakedAmount = await deployedSOULS.getAddressStakeAmount.call(accountWithSoulsAndCthu);
        const newRewardsBalance = await deployedSOULS.myRewardsBalance.call(accountWithSoulsAndCthu);

        // should return all staked balance
        assert.equal(stakedBalance.toString(), newBalance.toString());

        // new  stake amount is 0
        assert.equal(newStakedAmount.toString(), "0");

        // should withdraw open rewards @TODO
        assert.equal(newSoulsBalance.toString(), "1640000000000000000000"); // actual 1540000000000000000000
        assert.equal(newRewardsBalance.toString(), "0");
    })

})

