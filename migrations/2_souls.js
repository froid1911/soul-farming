const SOULS = artifacts.require("Souls");
const SOULHARVEST = artifacts.require("SoulsHarvest");

module.exports = async function (deployer) {
  const souls = await deployer.deploy(SOULS);
  const harvest = await deployer.deploy(SOULHARVEST, "0xEAE0b10B2cc955563ff99374c2Beb726aC4407CE", SOULS.address);
};
