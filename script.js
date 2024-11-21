let web3;
let contract;
let userAddress;

// ABI вашего контракта
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
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "getBalanceOf",
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
    {
        "inputs": [],
        "name": "name",
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
    {
        "inputs": [],
        "name": "symbol",
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
    {
        "inputs": [],
        "name": "totalSupply",
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
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Адрес вашего контракта
const contractAddress = "0x3d6C000465a753BBf301b8E8F9f0c2a56BEC5e9b";

// Функция для получения данных при загрузке страницы
window.onload = async () => {
    const connectButton = document.getElementById('connectButton');
    connectButton.addEventListener('click', connectWallet);

    // Если MetaMask уже подключен, получаем адрес кошелька
    if (typeof window.ethereum !== 'undefined') {
        console.log("MetaMask найден");
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        userAddress = await web3.eth.getCoinbase();
        document.getElementById('walletAddress').textContent = `Wallet Address: ${userAddress}`;
    } else {
        alert("MetaMask не установлен");
    }
};

// Подключение к кошельку
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        console.log("Подключение к MetaMask...");
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = await web3.eth.getCoinbase();
        document.getElementById('walletAddress').textContent = `Wallet Address: ${userAddress}`;
        fetchTokenData();
    } else {
        alert("MetaMask не найден. Установите MetaMask и повторите попытку.");
    }
}

// Получаем информацию о балансе токенов, картинку и цене
async function fetchTokenData() {
    try {
        contract = new web3.eth.Contract(tokenABI, contractAddress);

        // Получаем баланс токенов
        const balance = await contract.methods.balanceOf(userAddress).call();
        const decimals = await contract.methods.decimals().call();
        const balanceInToken = balance / (10 ** decimals);  // Преобразуем в читаемый вид

        document.getElementById('balance').textContent = `Balance: ${balanceInToken} USDT`;

        // Получаем картинку токена (если есть)
        const tokenImage = await contract.methods.image().call();
        document.getElementById('tokenImage').src = tokenImage;

        // Получаем цену токенов через API CoinGecko
        const tokenPriceInUSD = await getTokenPrice();
        const balanceInUSD = balanceInToken * tokenPriceInUSD;
        document.getElementById('balanceUSD').textContent = `Balance in USD: $${balanceInUSD.toFixed(2)}`;
    } catch (error) {
        console.error("Ошибка при получении данных о токенах:", error);
        document.getElementById('balance').textContent = "Ошибка при получении баланса.";
        document.getElementById('balanceUSD').textContent = "Ошибка при получении баланса в USD.";
    }
}

// Получаем цену токенов через API CoinGecko
async function getTokenPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd');
        const data = await response.json();
        if (data && data.tether) {
            return data.tether.usd; 
