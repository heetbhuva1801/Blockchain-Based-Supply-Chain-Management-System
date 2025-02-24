const SupplyChain = artifacts.require("SupplyChain");

module.exports = function (deployer) {
  // Deploy the SupplyChain contract to the blockchain
  deployer.deploy(SupplyChain);
};
