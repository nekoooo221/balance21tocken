// Убедитесь, что Web3 доступен
let web3;

window.onload = () => {
    if (typeof window.ethereum !== "undefined") {
        web3 = new Web3(window.ethereum);

        // Проверка на наличие MetaMask и Trust Wallet
        if (window.ethereum.isMetaMask) {
            console.log("MetaMask найден");
        } else if (window.ethereum.isTrust) {
            console.log("Trust Wallet найден");
        } else {
            console.log("Кошелек не найден");
        }
    } else {
        alert("Пожалуйста, установите MetaMask или Trust Wallet");
    }

    // Подключение к кошельку
    document.getElementById("connectButton").addEventListener("click", async () => {
        try {
            // Запрашиваем доступ к аккаунту
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const userAddress = accounts[0];
            document.getElementById("walletAddress").textContent = userAddress;

            // Показать балансы
            fetchBalance(userAddress);
        } catch (error) {
            console.error("Ошибка подключения:", error);
        }
    });
};

// Функция для получения баланса токенов
async function fetchBalance(address) {
    const tokenAddress = "0x3d6C000465a753BBf301b8E8F9f0c2a56BEC5e9b"; // Ваш контракт
    const tokenABI = [
        {
            "constant": true,
            "inputs": [{ "name": "account", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "", "type": "uint256" }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [{ "name": "", "type": "uint8" }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

    try {
        // Получение баланса
        const balance = await tokenContract.methods.balanceOf(address).call();
        const decimals = await tokenContract.methods.decimals().call();

        // Баланс с учетом десятичных знаков
        const balanceWithDecimals = balance / Math.pow(10, decimals);

        // Отображаем баланс
        document.getElementById("balance").textContent = balanceWithDecimals;

        // Показать баланс в USD (предположим, что 1 токен = 1 USD)
        document.getElementById("balanceUSD").textContent = `$${balanceWithDecimals}`;
    } catch (error) {
        console.error("Ошибка получения данных о токенах:", error);
    }
}

// Генерация QR-кода для подключения Trust Wallet (мобильное приложение)
function generateQRCode() {
    const qrCodeData = 'ethereum:' + "0x3d6C000465a753BBf301b8E8F9f0c2a56BEC5e9b"; // Адрес контракта
    new QRCode(document.getElementById("qrcodeContainer"), qrCodeData);
}

if (window.ethereum.isTrust) {
    generateQRCode();
}
