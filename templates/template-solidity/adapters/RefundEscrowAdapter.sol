pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/payment/escrow/RefundEscrow.sol";

/**
 * @title Basic Refund Escrow Contract Adapter
 * @dev Basic implementation of MintableToken with initial supply of 
 */
contract RefundEscrowAdapter is RefundEscrow {

    constructor ( 
      address escrowAccount
    )
      RefundEscrow(escrowAccount) 
    public {
    }
}