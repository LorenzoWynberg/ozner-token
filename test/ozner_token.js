const OznerToken = artifacts.require("OznerToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("OznerToken", function (accounts) {
  /*
   * Set total supply to one million tokens,
   * then allocates them to the admin account
   */
  it('Sets total supply upon deployment', async () => {
    let tokenInstance = await OznerToken.deployed();
    let totalSupply = await tokenInstance.totalSupply();
    assert.equal(totalSupply.toNumber(), 1000000, 'Sets the total supply to 1 million');
    let adminBalance = await tokenInstance.balanceOf(accounts[0]);
    assert.equal(adminBalance.toNumber(), 1000000, 'Alocates initial supply to the admin account');
  });
});