// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract OznerToken {
  string public name = "Ozner Token";
  string public symbol = "OZ";
  string public standard = "Ozner Token v1.0";
  uint256 public totalSupply;

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  constructor(uint256 _initialSupply) public {
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
  }

  // Transfer
  function transfer(address _to, uint256 _value) public returns(bool success) {

    // Exception if account doesn't have enough funds
    require(balanceOf[msg.sender] >= _value, "Invalid amount");

    // Transfer the balance
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    // Transfer events
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  // Approve
  function approve(address _spender, uint256 _value) public returns(bool success) {

    // Set allowance
    allowance[msg.sender][_spender] = _value;

    // Approve event
    emit Approval(msg.sender, _spender, _value);

    return true;
  }

  //Transfer From
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    
    // Validate that _value is lower than account balance
    require(_value <= balanceOf[_from], "Cannot transfer more than available balance");

    // Validate that _value is lower than approved
    require(_value <= allowance[_from][msg.sender], "Cannot transfer more than approved");

    // Update balances
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    // Update allowance
    allowance[_from][msg.sender] -= _value;
    
    // Transfer event
    emit Transfer(_from, _to, _value);

    return true; 
  }
}
