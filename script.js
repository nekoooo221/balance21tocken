// URL вашего контракта
const contractAddress = "0x3d6C000465a753BBf301b8E8F9f0c2a56BEC5e9b"; // Ваш адрес контракта

// ABI вашего контракта
const tokenABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

// Подключение к Web3
let web3;
let tokenContract;

window.onload = async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log("MetaMask detected");
        web3 = new Web3(window.ethereum);
        tokenContract = new web3.eth.Contract(tokenABI, contractAddress);
    } else {
        console.log("MetaMask is not installed.");
    }
};

// Функция для получения баланса токенов
async function fetchTokenBalance(address) {
    try {
        const balance = await tokenContract.methods.balanceOf(address).call();
        const decimals = await tokenContract.methods.decimals().call();
        const formattedBalance = web3.utils.fromWei(balance, 'ether'); // Преобразуем из Wei в эфир
        const formattedTokenBalance = parseFloat(formattedBalance).toFixed(4); // Ограничиваем до 4 знаков после запятой
        document.getElementById('balance').textContent = `${formattedTokenBalance} USDT`;
    } catch (error) {
        console.error("Error fetching token balance:", error);
        document.getElementById('balance').textContent = "Error fetching balance";
    }
}

// Функция для подключения кошелька
async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];
        document.getElementById('wallet-address').textContent = `Wallet Address: ${userAddress}`;
        await fetchTokenBalance(userAddress);
    } catch (error) {
        console.error("Error connecting wallet:", error);
    }
}

// Функция для отображения курса в USD
async function fetchTokenPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd');
        const data = await response.json();
        const priceInUSD = data.tether.usd;
        document.getElementById('balance-usd').textContent = `Balance in USD: $${priceInUSD}`;
    } catch (error) {
        console.error("Error fetching USD price:", error);
        document.getElementById('balance-usd').textContent = "Error fetching USD price";
    }
}

// Обработчик кнопки подключения кошелька
document.getElementById('connect-wallet').addEventListener('click', connectWallet);
