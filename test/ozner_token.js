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

  /**
   * Transfers token ownership:
   * Sends 250,000 tokens from accounts[1]
   * to accounts[2]
   */
  it('Transfers token ownership', async () => {
    let tokenInstance = await OznerToken.deployed();
    let totalSupply = await tokenInstance.totalSupply();
    totalSupply = totalSupply.toNumber();

    try {
      //Try to send double the total supply
      await tokenInstance.transfer.call(accounts[1], totalSupply*2);
    } catch (err) {
      assert(err.message.indexOf('revert') >= 0, 'Invalid transfer amount');
    }

    //Transfer 250,000 tokens from accounts[1] to accounts[2]
    let transfer = await tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] })
    assert.equal(transfer, true, 'Transfer success returns true');

    //Check receipt data
    let receipt = await tokenInstance.transfer(accounts[1], 250000, {from:accounts[0]});
    assert.equal(receipt.logs.length, 1, 'Triggers one event');
    assert.equal(receipt.logs[0].event, 'Transfer', 'Should be the transfer event');
    assert.equal(receipt.logs[0].args._from, accounts[0], 'Logs the sender');
    assert.equal(receipt.logs[0].args._to, accounts[1], 'Logs the receiver');
    assert.equal(receipt.logs[0].args._value, 250000, 'Logs the amount transferred');

    //Checks that amount was credited to receiver
    let balanceReceiver = await tokenInstance.balanceOf(accounts[1]);
    balanceReceiver = balanceReceiver.toNumber();
    assert.equal(balanceReceiver, 250000, 'Adds amount to receiving account');

    //Checks that amount was deducted from sender
    let balanceSender = await tokenInstance.balanceOf(accounts[0]);
    balanceSender = balanceSender.toNumber();
    assert.equal(balanceSender, 750000, 'Deducts amount from sender account');
  });

});