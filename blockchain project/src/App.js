import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SupplyChainContract from './contracts/SupplyChain.json';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');

  // Function to load blockchain data and initialize contract
  const loadBlockchainData = async () => {
    try {
      console.log("Loading blockchain data...");
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545"); // Ensure Ganache is running on this port

      // Fetch user accounts from MetaMask
      const accounts = await web3.eth.requestAccounts();
      console.log("Connected account:", accounts[0]);
      setAccount(accounts[0]);

      // Get the network ID
      const networkId = await web3.eth.net.getId();
      console.log("Network ID:", networkId);
      const networkData = SupplyChainContract.networks[networkId];

      if (networkData) {
        // Initialize contract instance
        const supplyChain = new web3.eth.Contract(SupplyChainContract.abi, networkData.address);
        setContract(supplyChain);
        console.log("Contract Address:", networkData.address);

        // Load product count and details
        const productCount = await supplyChain.methods.productCounter().call();
        console.log("Total Products:", productCount);
        const productsArray = [];
        for (let i = 1; i <= productCount; i++) {
          const product = await supplyChain.methods.products(i).call();
          productsArray.push(product);
          console.log("Product Loaded:", product);
        }
        setProducts(productsArray);
      } else {
        alert("Smart contract not deployed to the detected network.");
      }
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    }
  };

  // Function to add a new product
  const addProduct = async () => {
    if (contract && productName && productDescription && productPrice) {
      try {
        const priceInWei = Web3.utils.toWei(productPrice, 'ether'); // Convert Ether to Wei
        console.log("Adding product with name:", productName, "description:", productDescription, "price:", priceInWei);
        await contract.methods.createProduct(productName, productDescription, priceInWei).send({ from: account, gas: 300000 });
        alert("Product added successfully!");

        // Reload products to show the newly added product
        loadBlockchainData();
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Transaction failed. Check the console for details.");
      }
    } else {
      alert("Please connect to the contract and fill in all product details.");
    }
  };

  // Load blockchain data when the component mounts
  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Supply Chain Management</h2>
      <p>Connected Account: {account}</p>

      <div>
        <h3>Create a New Product</h3>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Product Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Product Price (in Ether)"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={addProduct}>Add Product</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Products List</h3>
        {products.length > 0 ? (
          <ul>
            {products.map((product, index) => (
              <li key={index}>
                <strong>Name:</strong> {product.name} | 
                <strong> Description:</strong> {product.description} | 
                <strong> Price:</strong> {Web3.utils.fromWei(product.price, 'ether')} Ether | 
                <strong> Owner:</strong> {product.owner}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
}

export default App;
