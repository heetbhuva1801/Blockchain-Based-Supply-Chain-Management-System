module.exports = {
    // Networks define how you connect to different Ethereum networks
    networks: {
      // Development network (Ganache)
      development: {
        host: "127.0.0.1",  // Localhost
        port: 7545,         // Ganache default port
        network_id: "5777",    // Match any network id
      },
      // Example of a testnet configuration (Ropsten or Goerli)
      ropsten: {
        provider: () => new HDWalletProvider(
          process.env.MNEMONIC, // Your wallet mnemonic
          `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}` // Infura API key
        ),
        network_id: 3,       // Ropsten's network id
        gas: 5500000,        // Gas limit
        confirmations: 2,    // Number of confirmations to wait for
        timeoutBlocks: 200,  // Number of blocks before a deployment times out
        skipDryRun: true     // Skip dry run before migrations
      },
      // Configuration for Goerli testnet
      goerli: {
        provider: () => new HDWalletProvider(
          process.env.MNEMONIC, // Your wallet mnemonic
          `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
        ),
        network_id: 5,        // Goerli network id
        gas: 5500000,         // Gas limit
        confirmations: 2,
        timeoutBlocks: 200,
        skipDryRun: true
      },
    },
  
    // Set default mocha options here, use special reporters, etc.
    mocha: {
      timeout: 100000
    },
  
    // Configure your compilers
    compilers: {
      solc: {
        version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's installed solc)
        settings: {
          optimizer: {
            enabled: true,   // Enable the optimizer
            runs: 200        // Optimize for how many times you intend to run the code
          },
          evmVersion: "istanbul"  // The EVM version to compile against
        }
      }
    },
  
    // Optional settings for Truffle DB (disabled by default)
    db: {
      enabled: false
    }
  };
  