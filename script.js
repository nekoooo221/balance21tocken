// Убедимся, что Web3 доступен
if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
    console.log("Web3 доступен");
} else {
    alert("Web3 не найден. Пожалуйста, установите MetaMask или Trust Wallet.");
}

// Контракт и ABI (поставь свой ABI сюда)
const contractAddress = '0x3d6C000465a753BBf301b8E8F9f0c2a56BEC5e9b'; // Адрес контракта
const tokenABI = [
    // Вставь свой ABI сюда
];

// Функция для подключения кошелька
document.getElementById('connectWallet').addEventListener('click', connectWallet);

async function connectWallet() {
    if (window.ethereum) {
        try {
            // Запросим подключение MetaMask или Trust Wallet
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            const userAddress = accounts[0];
            document.getElementById('walletAddress').textContent = `Wallet Address: ${userAddress}`;

            // Инициализация контракта
            const tokenContract = new web3.eth.Contract(tokenABI, contractAddress);
            await fetchTokenBalance(tokenContract, userAddress);

        } catch (error) {
            console.error(error);
            alert("Ошибка подключения кошелька");
        }
    } else {
        alert("Убедитесь, что у вас установлен MetaMask или Trust Wallet");
    }
}

// Функция для получения баланса токенов
async function fetchTokenBalance(tokenContract, userAddress) {
    try {
        const balance = await tokenContract.methods.balanceOf(userAddress).call();
        const decimals = await tokenContract.methods.decimals().call();
        const formattedBalance = balance / (10 ** decimals); // Преобразуем в читаемую форму
        document.getElementById('balance').textContent = `Balance: ${formattedBalance} USDT`;

        // Преобразуем в доллары
        const usdBalance = formattedBalance * 1; // Цена токена = 1 доллар
        document.getElementById('usdBalance').textContent = `Balance in USD: $${usdBalance.toFixed(2)}`;
    } catch (error) {
        console.error(error);
        alert("Ошибка при получении баланса токенов");
    }
}

// Функция для открытия кошелька через Trust Wallet или MetaMask на мобильных устройствах
function openMobileWallet() {
    if (window.ethereum && window.ethereum.isMetaMask) {
        window.location.href = "metamask://";
    } else if (window.ethereum && window.ethereum.isTrust) {
        window.location.href = "trust://";
    } else {
        alert("Кошелек не поддерживается");
    }
}
