let web3;
let userAccount;
const contractAddress = '0x173799E94Bf1d95Da829B7F7099cC13C583f3E27'; // Ваш контракт
const contractABI = [ 
  // Вставьте сюда ABI контракта
];

// Инициализация Web3 и подключение кошелька
window.onload = function() {
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    document.getElementById('connect-wallet').addEventListener('click', connectWallet);
  } else {
    alert('Please install MetaMask!');
  }
};

// Подключение кошелька
async function connectWallet() {
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    userAccount = accounts[0];
    document.getElementById('connect-wallet').innerText = 'Wallet Connected';
    getBalance();
  } catch (error) {
    console.error(error);
  }
}

// Получение баланса токенов и отображение на странице
async function getBalance() {
  if (!web3 || !userAccount) return;

  const contract = new web3.eth.Contract(contractABI, contractAddress);
  
  // Получаем баланс токенов
  const balance = await contract.methods.balanceOf(userAccount).call();
  
  // Преобразуем баланс в формат с 18 знаками после запятой
  const balanceFormatted = web3.utils.fromWei(balance, 'ether');
  
  // Отображаем баланс токенов
  document.getElementById('balance-usdt').innerText = balanceFormatted;
  
  // Цена токена в долларах (фиксированная или через API)
  const tokenPriceInUSD = 1; // В этом случае цена фиксирована на 1 USD
  const balanceInUSD = (balanceFormatted * tokenPriceInUSD).toFixed(2);
  document.getElementById('balance-usd').innerText = balanceInUSD;
}
