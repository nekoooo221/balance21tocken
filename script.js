// Адрес контракта и ABI для USDT
const tokenAddress = "0x3d6C000465a753BBf301b8E8F9f0c2a56BEC5e9b";  // Твой адрес контракта
const tokenABI = [
    {
        "inputs": [],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let userAccount;

window.onload = () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        window.ethereum.enable().catch(err => console.log("Error enabling Ethereum"));
    } else {
        alert("Please install MetaMask or Trust Wallet.");
    }
};

// Функция для подключения кошелька
async function connectWallet() {
    try {
        const accounts = await web3.eth.requestAccounts();
        userAccount = accounts[0];
        document.getElementById('walletAddress').textContent = `Wallet Address: ${userAccount}`;
        fetchTokenBalance();
    } catch (err) {
        console.error("Error connecting wallet:", err);
    }
}

// Функция для получения баланса токенов
async function fetchTokenBalance() {
    try {
        const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
        
        // Получаем баланс
        const balance = await tokenContract.methods.balanceOf(userAccount).call();
        
        // Получаем количество десятичных знаков
        const decimals = await tokenContract.methods.decimals().call();

        // Преобразуем баланс в нужный формат с учетом десятичных знаков
        const balanceInTokenUnits = balance / Math.pow(10, decimals);

        // Отображаем баланс токенов
        document.getElementById('balance').textContent = balanceInTokenUnits.toFixed(6); // Форматируем с 6 знаками после запятой

        // Получаем текущую цену USDT в долларах через CoinGecko API
        const priceInUSD = await getTokenPriceInUSD();
        const balanceInUSD = balanceInTokenUnits * priceInUSD;
        document.getElementById('usdBalance').textContent = balanceInUSD.toFixed(2); // Форматируем с 2 знаками после запятой

    } catch (err) {
        console.error("Error fetching balance or token data:", err);
        document.getElementById('balance').textContent = "Error fetching balance";
        document.getElementById('usdBalance').textContent = "Error fetching USD price";
    }
}

// Функция для получения цены токена USDT в USD через CoinGecko API
async function getTokenPriceInUSD() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd');
        const data = await response.json();
        return data.tether.usd;
    } catch (err) {
        console.error("Error fetching token price from CoinGecko:", err);
        return 1; // Если ошибка, возвращаем 1 доллар
    }
}

// Обработчик для кнопки подключения кошелька
document.getElementById('connectButton').addEventListener('click', connectWallet);
