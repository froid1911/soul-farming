const CTHU = artifacts.require("BaseToken");
const SOULS = artifacts.require("Souls");
const SOULHARVEST = artifacts.require("SoulsHarvest");

module.exports = async function (deployer) {
  let cthuAddress = "0xEAE0b10B2cc955563ff99374c2Beb726aC4407CE";
  // Deploy Instance on Testnets
  if (deployer.network !== 'production') {
    await deployer.deploy(CTHU, "cthu", "cthu", "18", "20000000000000000000000000", "10000000000000000000000000", true, false);
    cthuAddress = CTHU.address;
  }

  await deployer.deploy(SOULS);
  await deployer.deploy(SOULHARVEST, cthuAddress, SOULS.address);
};
