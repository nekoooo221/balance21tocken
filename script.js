// ABI для контракта
const tokenABI = [
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "image",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const tokenAddress = '0x3d6C000465a753BBf301b8E8F9f0c2a56BEC5e9b'; // Адрес контракта

let web3;
let tokenContract;
let userAddress;

// Подключаем кошелек (MetaMask или Trust Wallet)
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
            userAddress = (await web3.eth.getAccounts())[0];
            document.getElementById('walletAddress').innerText = userAddress;
            fetchBalance();
        } catch (error) {
            console.error("Ошибка подключения кошелька:", error);
        }
    } else {
        alert("Убедитесь, что у вас установлен MetaMask или Trust Wallet");
    }
}

// Получаем баланс токенов и изображение
async function fetchBalance() {
    try {
        const balance = await tokenContract.methods.balanceOf(userAddress).call();
        const decimals = await tokenContract.methods.decimals().call();
        const formattedBalance = balance / (10 ** decimals);
        document.getElementById('balance').innerText = formattedBalance;

        // Получаем картинку токена
        const tokenImage = await tokenContract.methods.image().call();
        document.getElementById('tokenImage').src = tokenImage;

        // Получаем курс в USD
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd')
            .then(response => response.json())
            .then(data => {
                const usdPrice = data.tether.usd;
                document.getElementById('balanceUSD').innerText = (formattedBalance * usdPrice).toFixed(2);
            })
            .catch(error => console.error('Ошибка при получении курса USD:', error));
    } catch (error) {
        console.error('Ошибка при получении баланса токенов:', error);
        document.getElementById('balance').innerText = 'Error fetching balance';
    }
}

// Обработчик клика по кнопке подключения
document.getElementById('connectButton').addEventListener('click', connectWallet);
