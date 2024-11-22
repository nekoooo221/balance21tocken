window.onload = async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask или Trust Wallet найден');

        const connectButton = document.querySelector("#connectButton");
        if (connectButton) {
            connectButton.addEventListener("click", async () => {
                await connectWallet();
            });
        } else {
            console.error("Кнопка для подключения не найдена!");
        }
    } else {
        alert("MetaMask или Trust Wallet не установлен! Пожалуйста, установите MetaMask или Trust Wallet.");
    }
};

// Функция подключения к кошельку
async function connectWallet() {
    try {
        // Запрос на подключение кошелька
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const account = accounts[0];

        document.getElementById("walletAddress").textContent = account;
        document.getElementById("walletInfo").style.display = "block";
        
        console.log("Подключён кошелёк: ", account);

        // Получение баланса
        await fetchTokenBalance(account);
    } catch (error) {
        console.error("Ошибка подключения:", error);
        document.getElementById("error").textContent = "Ошибка при подключении кошелька.";
    }
}

// ABI токена
const tokenABI = [
    {
        "constant": true,
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

// Адрес контракта токена
const tokenAddress = '0x3d6C000465a753BBf301b8E8F9f0c2a56BEC5e9b';

// Получение баланса токенов
async function fetchTokenBalance(account) {
    const web3 = new Web3(window.ethereum);
    const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

    try {
        const balance = await tokenContract.methods.balanceOf(account).call();
        const decimals = await tokenContract.methods.decimals().call();

        // Переводим баланс с учетом десятичных знаков
        const balanceInTokens = web3.utils.fromWei(balance, 'ether');
        document.getElementById("balance").textContent = `Баланс: ${balanceInTokens} USDT`;

        // Получение курса USDT в долларах через CoinGecko API
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd')
            .then(response => response.json())
            .then(data => {
                const usdPrice = data.tether.usd;
                const balanceInUSD = (parseFloat(balanceInTokens) * usdPrice).toFixed(2);
                document.getElementById("usdBalance").textContent = `Баланс в USD: $${balanceInUSD}`;
            })
            .catch(error => {
                console.error('Ошибка при получении данных о цене USDT:', error);
                document.getElementById("usdBalance").textContent = "Ошибка при получении данных о цене USDT";
            });
    } catch (error) {
        console.error('Ошибка при получении баланса токенов:', error);
        document.getElementById("balance").textContent = "Ошибка при получении баланса токенов";
    }
}
