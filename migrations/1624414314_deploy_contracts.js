const OznerToken = artifacts.require("OznerToken");

module.exports = function (deployer) {
  deployer.deploy(OznerToken, 1000000);
};
