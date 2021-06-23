const OznerToken = artifacts.require("OznerToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("OznerToken", function (accounts) {
    
  /**
  * Sets values:
  * name, symbol, standard
  */
  it('Initializes contract with proper values', async () => {
    let tokenInstance = await OznerToken.deployed();
    let tokenName = await tokenInstance.name();
    assert.equal(tokenName, 'Ozner Token', 'Has correct name');
    let tokenSymbol = await tokenInstance.symbol();
    assert.equal(tokenSymbol, 'OZ', 'Has correct symbol');
    let tokenStandard = await tokenInstance.standard();
    assert.equal(tokenStandard, 'Ozner Token v1.0', 'Has correct standard');
  });

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