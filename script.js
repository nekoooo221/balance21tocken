let web3;
let userAccount;
const contractAddress = '0x173799E94Bf1d95Da829B7F7099cC13C583f3E27'; // Адрес вашего контракта
const contractABI = [ 
  // Ваш ABI контракта (здесь нужно вставить реальные данные)
];

// Инициализация Web3
window.onload = function() {
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    console.log("MetaMask найден");
    document.getElementById('connect-wallet').addEventListener('click', connectWallet);
  } else {
    alert('Пожалуйста, установите MetaMask!');
  }
};

// Функция для подключения кошелька
async function connectWallet() {
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    userAccount = accounts[0];
    console.log("Подключен аккаунт:", userAccount);
    document.getElementById('connect-wallet').innerText = 'Wallet Connected';
    getBalance();
  } catch (error) {
    console.error("Ошибка при подключении кошелька:", error);
  }
}

// Получение баланса токенов и отображение на странице
async function getBalance() {
  if (!web3 || !userAccount) return;

  const contract = new web3.eth.Contract(contractABI, contractAddress);
  
  // Получаем баланс токенов
  const balance = await contract.methods.balanceOf(userAccount).call();
  console.log("Баланс токенов:", balance);  // Логируем баланс

  // Преобразуем баланс в формат с 18 знаками после запятой
  const balanceFormatted = web3.utils.fromWei(balance, 'ether');
  console.log("Отформатированный баланс:", balanceFormatted);  // Логируем отформатированный баланс

  // Отображаем баланс токенов
  document.getElementById('balance-usdt').innerText = balanceFormatted;
  
  // Цена токена в долларах (фиксированная или через API)
  const tokenPriceInUSD = 1; // В этом случае цена фиксирована на 1 USD
  const balanceInUSD = (balanceFormatted * tokenPriceInUSD).toFixed(2);
  console.log("Баланс в USD:", balanceInUSD);  // Логируем баланс в долларах
  document.getElementById('balance-usd').innerText = balanceInUSD;
}
