// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    uint public productCounter = 0;

    enum State { Created, Manufactured, ForSale, Sold, Shipped, Delivered }

    struct Product {
        uint id;
        string name;               // Product name (short)
        string description;        // Product description (short)
        uint price;                // Product price in Wei
        address payable owner;     // Owner's address
        State state;               // Product state in supply chain
    }

    mapping(uint => Product) public products;

    event ProductCreated(uint productId, string name, uint price, address owner);

    modifier onlyOwner(uint _productId) {
        require(msg.sender == products[_productId].owner, "Not the product owner");
        _;
    }

    modifier inState(uint _productId, State _state) {
        require(products[_productId].state == _state, "Invalid product state");
        _;
    }

    // Rename createProduct to addProduct
    function addProduct(
        string memory _name,
        string memory _description,
        uint _price
    ) public {
        productCounter++;
        products[productCounter] = Product(
            productCounter,
            _name,
            _description,
            _price,
            payable(msg.sender),
            State.Created
        );
        emit ProductCreated(productCounter, _name, _price, msg.sender);
    }

    // Additional functions for state transitions (manufacturing, selling, shipping, etc.) can be added here
}
