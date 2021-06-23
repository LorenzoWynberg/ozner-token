// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract OznerToken {
  string public name = "Ozner Token";
  string public symbol = "OZ";
  string public standard = "Ozner Token v1.0";
  uint256 public totalSupply;

  mapping(address => uint256) public balanceOf;

  event Transfer(
    address indexed _from,
    address indexed _to,
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
}
