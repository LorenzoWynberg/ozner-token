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
      // Try to send double the total supply
      await tokenInstance.transfer.call(accounts[1], totalSupply*2);
    } catch (err) {
      assert(err.message.indexOf('revert') >= 0, 'Invalid transfer amount');
    }

    // Transfer 250,000 tokens from accounts[1] to accounts[2]
    let transfer = await tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] })
    assert.equal(transfer, true, 'Transfer success returns true');

    // Checks logs
    let receipt = await tokenInstance.transfer(accounts[1], 250000, {from:accounts[0]});
    assert.equal(receipt.logs.length, 1, 'Triggers one event');
    assert.equal(receipt.logs[0].event, 'Transfer', 'Should be the transfer event');
    assert.equal(receipt.logs[0].args._from, accounts[0], 'Logs the sender');
    assert.equal(receipt.logs[0].args._to, accounts[1], 'Logs the receiver');
    assert.equal(receipt.logs[0].args._value, 250000, 'Logs the amount transferred');

    // Checks that amount was credited to receiver
    let balanceReceiver = await tokenInstance.balanceOf(accounts[1]);
    balanceReceiver = balanceReceiver.toNumber();
    assert.equal(balanceReceiver, 250000, 'Adds amount to receiving account');

    // Checks that amount was deducted from sender
    let balanceSender = await tokenInstance.balanceOf(accounts[0]);
    balanceSender = balanceSender.toNumber();
    assert.equal(balanceSender, 750000, 'Deducts amount from sender account');
  });

  /*
   *
   *
   */
  it('Approves tokens for delegated transfer', async () => {
    let tokenInstance = await OznerToken.deployed();
    let success = await tokenInstance.approve.call(accounts[1], 100);
    assert.equal(success, true, 'Returns True');

    let receipt = await tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
    assert.equal(receipt.logs.length, 1, 'Triggers one event');
    assert.equal(receipt.logs[0].event, 'Approval', 'Should be the approval event');
    assert.equal(receipt.logs[0].args._owner, accounts[0], 'Logs the account the tokens are authorized by');
    assert.equal(receipt.logs[0].args._spender, accounts[1], 'Logs the account the tokens are authorized to');
    assert.equal(receipt.logs[0].args._value, 100, 'Logs the amount transferred');

    let allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
    allowance = allowance.toNumber();
    assert.equal(allowance, 100, 'Stores the allowance for delegated transfer');
  });

  it('Handles delegated token transfers', async () => {
    let tokenInstance = await OznerToken.deployed();

    let main = accounts[0];
    let from = accounts[2];
    let to = accounts[3];
    let spender = accounts[4];

    // Transfer some tokens to from account
    tokenInstance.transfer(from, 100, { from: main });

    // Approve spender to spend 10 tokens from from account
    tokenInstance.approve(spender, 10, { from: from });

    // Transfer more than sender's balance
    try {
      await tokenInstance.transferFrom(from, to, 99999, { from: spender });
    } catch (err) {
      assert(err.message.indexOf('revert') >= 0, 'Cannot transfer more than available balance');
    }

    // Transfer more than approved amount
    try {
      await tokenInstance.transferFrom(from, to, 20, { from: spender });
    } catch (err) {
      // console.log(err);
      assert(err.message.indexOf('revert') >= 0, 'Cannot transfer more than approved');
    }

    // Check if proper transaction returns true
    let success = await tokenInstance.transferFrom.call(from, to, 10, { from: spender });
    assert.equal(success, true);

    // Checks logs
    let receipt = await tokenInstance.transferFrom(from, to, 10, { from: spender });
    assert.equal(receipt.logs.length, 1, 'Triggers one event');
    assert.equal(receipt.logs[0].event, 'Transfer', 'Should be the "Transfer" event');
    assert.equal(receipt.logs[0].args._from, from, 'Logs the account the tokens are transferred from');
    assert.equal(receipt.logs[0].args._to, to, 'Logs the account the tokens are transferred to');
    assert.equal(receipt.logs[0].args._value, 10, 'Logs the amount transferred');

    // Sends and receives proper balance
    let balanceFrom = await tokenInstance.balanceOf(from);
    assert.equal(balanceFrom.toNumber(), 90, 'Deducts the correct amount from sending account [from]');
    let balanceTo = await tokenInstance.balanceOf(to);
    assert.equal(balanceTo.toNumber(), 10, 'Adds the correct amount to the receiving account [to]');

    // Updates allowance
    let allowance = await tokenInstance.allowance(from, spender);
    assert.equal(allowance, 0, 'Deducts amount from allowance');
  });
});
























