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

// Инициализация Web3 и подключения к MetaMask
window.onload = async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log("MetaMask найден");
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // запрос разрешения
        userAddress = await web3.eth.getCoinbase();
        console.log("Ваш адрес:", userAddress);

        contract = new web3.eth.Contract(tokenABI, contractAddress);

        // Получение баланса токенов
        const balance = await contract.methods.balanceOf(userAddress).call();
        const decimals = await contract.methods.decimals().call();
        const balanceInToken = balance / (10 ** decimals); // баланс в токенах

        document.getElementById('balance').textContent = `Balance: ${balanceInToken} USDT`;
        
        // Получение картинки токена (например, если эта информация есть в вашем контракте)
        const tokenImage = await contract.methods.image().call();
        document.getElementById('tokenImage').src = tokenImage;

        // Получение цены токена и расчет баланса в долларах (например, через CoinGecko API)
        const tokenPriceInUSD = await getTokenPrice(); // запрос цены
        const balanceInUSD = balanceInToken * tokenPriceInUSD;
        document.getElementById('balanceUSD').textContent = `Balance in USD: $${balanceInUSD.toFixed(2)}`;
    } else {
        alert("MetaMask не установлен");
    }
}

// Функция для получения цены токена (например, через CoinGecko API)
async function getTokenPrice() {
    const response = aw
