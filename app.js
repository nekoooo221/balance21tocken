// Подключение Web3.js через CDN
if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("MetaMask is connected");
    } catch (error) {
        console.error("User denied account access");
    }
} else {
    alert("Please install MetaMask");
}

// Адрес контракта и ABI
const contractAddress = '0x173799E94Bf1d95Da829B7F7099cC13C583f3E27'; // Адрес вашего контракта
const abiArray = [ /* Вставьте ваш ABI сюда */ ];

// Подключение к контракту
const contract = new web3.eth.Contract(abiArray, contractAddress);

// Получение баланса токенов
async function getBalance() {
    const accounts = await web3.eth.getAccounts();
    const balance = await contract.methods.balanceOf(accounts[0]).call();
    console.log('Balance in tokens:', balance);

    // Получение цены токена в USD с CoinGecko
    async function getTokenPrice() {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd');
        const data = await response.json();
        return data.tether.usd;
    }

    const tokenPrice = await getTokenPrice();
    const balanceInUSD = balance * tokenPrice;
    console.log("Balance in USD: $", balanceInUSD);
}

getBalance();
