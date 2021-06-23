const OznerToken = artifacts.require("OznerToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("OznerToken", function (accounts) {
  it("sets total supply upon deployment", function () {
    return OznerToken.deployed()
    .then(function(instance){
      return instance.totalSupply();
    })
    .then(function(totalSupply){
      assert.equal(totalSupply.toNumber(), 1000000, 'Sets the total supply to 1 million')
    });
  });
});