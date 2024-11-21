// ABI for the contract
const tokenABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "image",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    // Add other functions as needed...
];

// The address of your token contract
const tokenAddress = "0x3d6C000465a753BBf301b8E8F9f0c2a56BEC5e9b";

// Initialize Web3
let web3;

window.onload = () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        console.log('MetaMask найден');

        // Try to connect to MetaMask
        document.getElementById("connectButton").addEventListener("click", async () => {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            displayBalance();
        });
    } else {
        alert('MetaMask не установлен');
    }
};

// Function to display balance and token details
async function displayBalance() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    // Display wallet address
    document.getElementById('walletAddress').innerText = `Wallet Address: ${account}`;

    // Get token contract instance
    const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

    try {
        // Get balance of the wallet in tokens
        const balance = await tokenContract.methods.balanceOf(account).call();
        const decimals = await tokenContract.methods.decimals().call();
        const tokenBalance = balance / (10 ** decimals);  // Convert to human-readable format

        document.getElementById('balance').innerText = `Balance: ${tokenBalance} USDT`;

        // Display token image
        const tokenImage = await tokenContract.methods.image().call();
        document.getElementById('tokenImage').src = tokenImage;

        // Simulate USD balance (since USDT is pegged to 1 USD)
        const usdBalance = tokenBalance * 1;  // 1 USDT = 1 USD
        document.getElementById('balanceUSD').innerText = `Balance in USD: $${usdBalance}`;

    } catch (error) {
        console.error("Error fetching balance or token data:", error);
        alert("Ошибка при получении данных о токенах.");
    }
}
