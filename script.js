// Подключение Web3
let web3;
const contractAddress = "0x173799E94Bf1d95Da829B7F7099cC13C583f3E27"; // Адрес контракта
const tokenABI = [ /* ABI твоего контракта */ ];

window.onload = () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        document.getElementById('connect-wallet').onclick = connectWallet;
    } else {
        alert("Please install MetaMask!");
    }
};

// Подключение кошелька
async function connectWallet() {
    await ethereum.request({ method: 'eth_requestAccounts' });
    getBalance();
}

// Получение баланса
async function getBalance() {
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];
    const contract = new web3.eth.Contract(tokenABI, contractAddress);

    // Получаем баланс токенов
    const balance = await contract.methods.balanceOf(userAddress).call();
    
    // Конвертируем баланс в читаемый формат
    const formattedBalance = web3.utils.fromWei(balance, 'ether');
    document.getElementById('balance-value').innerText = formattedBalance;

    // Отображение баланса в долларах
    const usdBalance = formattedBalance * 1; // 1 токен = 1 доллар
    document.getElementById('usd-value').innerText = usdBalance.toFixed(2);
}
