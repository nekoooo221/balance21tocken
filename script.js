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

const contractAddress = '0x3d6C000465a753BBf301b8E8F9f0c2a56BEC5e9b'; // Адрес вашего контракта

// Функция для подключения к кошельку
async function connectWallet() {
    if (window.ethereum) {
        try {
            // Запрашиваем доступ к кошельку
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            const userAddress = accounts[0];

            document.getElementById('walletAddress').textContent = `Wallet Address: ${userAddress}`;

            const tokenContract = new web3.eth.Contract(tokenABI, contractAddress);
            
            // Получаем баланс токенов
            const balance = await tokenContract.methods.balanceOf(userAddress).call();
            const decimals = await tokenContract.methods.decimals().call();
            const formattedBalance = balance / (10 ** decimals);

            document.getElementById('balance').textContent = `Balance: ${formattedBalance} USDT`;

            // Получаем курс токена
            const usdBalance = await getTokenPrice();
            document.getElementById('usdBalance').textContent = `Balance in USD: $${(formattedBalance * usdBalance).toFixed(2)}`;

        } catch (error) {
            console.error("Ошибка при получении баланса токенов:", error);
            alert("Ошибка при подключении кошелька или получении баланса");
        }
    } else {
        alert("Убедитесь, что MetaMask или Trust Wallet установлен");
    }
}

// Функция для получения курса токена с CoinGecko
async function getTokenPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd');
        const data = await response.json();
        return data.tether.usd; // возвращает цену USDT в USD
    } catch (error) {
        console.error("Ошибка при получении цены токена:", error);
        return 1; // возвращаем 1, если не удалось получить цену
    }
}

// Запуск функции подключения
document.getElementById('connectButton').addEventListener('click', connectWallet);
