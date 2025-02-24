const SupplyChain = artifacts.require("SupplyChain");

contract("SupplyChain", (accounts) => {
  let supplyChainInstance;

  // Define the roles for testing
  const owner = accounts[0]; // Deployer of the contract
  const manufacturer = accounts[1]; // Another account acting as the manufacturer
  const buyer = accounts[2]; // Another account acting as the buyer

  before(async () => {
    // Deploy the contract before running the tests
    supplyChainInstance = await SupplyChain.deployed();
  });

  it("should deploy the contract successfully", async () => {
    // Test that the contract was deployed and has an address
    assert(supplyChainInstance.address !== '');
  });

  it("should create a new product", async () => {
    const name = "Test Product";
    const description = "This is a test product";
    const price = web3.utils.toWei('1', 'Ether'); // Price set to 1 Ether

    // Call createProduct method as the owner (supplier)
    await supplyChainInstance.createProduct(name, description, price, { from: owner });

    // Fetch the product from the contract
    const product = await supplyChainInstance.products(1);

    assert.equal(product.id.toNumber(), 1, "Product ID should be 1");
    assert.equal(product.name, name, "Product name should be 'Test Product'");
    assert.equal(product.description, description, "Product description should match");
    assert.equal(product.price, price, "Product price should be 1 Ether");
    assert.equal(product.owner, owner, "Product owner should be the supplier");
    assert.equal(product.state.toNumber(), 0, "Product state should be 'Created'");
  });

  it("should allow the manufacturer to manufacture a product", async () => {
    // Manufacturer manufactures the product (id: 1)
    await supplyChainInstance.manufactureProduct(1, { from: owner });

    const product = await supplyChainInstance.products(1);

    assert.equal(product.state.toNumber(), 1, "Product state should be 'Manufactured'");
  });

  it("should set the product for sale", async () => {
    const price = web3.utils.toWei('2', 'Ether'); // New price set to 2 Ether

    // Owner sets the product for sale
    await supplyChainInstance.setForSale(1, price, { from: owner });

    const product = await supplyChainInstance.products(1);

    assert.equal(product.state.toNumber(), 2, "Product state should be 'ForSale'");
    assert.equal(product.price, price, "Product price should be updated to 2 Ether");
  });

  it("should allow a buyer to purchase the product", async () => {
    const productPrice = web3.utils.toWei('2', 'Ether'); // The product price is 2 Ether

    // Buyer purchases the product by sending 2 Ether
    await supplyChainInstance.buyProduct(1, { from: buyer, value: productPrice });

    const product = await supplyChainInstance.products(1);

    assert.equal(product.owner, buyer, "Product owner should now be the buyer");
    assert.equal(product.state.toNumber(), 3, "Product state should be 'Sold'");
  });

  it("should allow the product to be shipped", async () => {
    // Buyer ships the product
    await supplyChainInstance.shipProduct(1, { from: buyer });

    const product = await supplyChainInstance.products(1);

    assert.equal(product.state.toNumber(), 4, "Product state should be 'Shipped'");
  });

  it("should allow the product to be delivered", async () => {
    // Buyer delivers the product
    await supplyChainInstance.deliverProduct(1, { from: buyer });

    const product = await supplyChainInstance.products(1);

    assert.equal(product.state.toNumber(), 5, "Product state should be 'Delivered'");
  });

  it("should prevent unauthorized actions", async () => {
    try {
      // Attempt to manufacture a product by a non-owner should fail
      await supplyChainInstance.manufactureProduct(1, { from: manufacturer });
      assert.fail("Non-owner should not be able to manufacture a product");
    } catch (error) {
      assert(error.message.includes("Not the owner"), "Error message should contain 'Not the owner'");
    }

    try {
      // Attempt to buy a product with insufficient funds should fail
      await supplyChainInstance.buyProduct(1, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') });
      assert.fail("Should not be able to buy with insufficient funds");
    } catch (error) {
      assert(error.message.includes("Insufficient funds"), "Error message should contain 'Insufficient funds'");
    }
  });
});
