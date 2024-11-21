document.addEventListener('DOMContentLoaded', function () {
    // Проверка наличия Web3
    if (typeof Web3 !== "undefined") {
        console.log("Web3 is available");
        var web3 = new Web3(window.ethereum); // Используем Ethereum провайдер от Metamask
    } else {
        console.log("Web3 is not available. Please install Metamask.");
    }

    // Элементы интерфейса
    const connectButton = document.getElementById("connectButton");
    const walletAddressElement = document.getElementById("walletAddress");
    const tokenBalanceElement = document.getElementById("tokenBalance");
    const usdBalanceElement = document.getElementById("usdBalance");

    let userAddress = "";

    // Функция для подключения кошелька
    connectButton.addEventListener('click', async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = (await web3.eth.getAccounts())[0];
            walletAddressElement.textContent = `Wallet Address: ${userAddress}`;
            fetchTokenData(); // Загружаем данные о токенах
        } catch (error) {
            console.error("User denied account access", error);
        }
    });

    // Функция для получения баланса токенов
    async function fetchTokenData() {
        const contract = new web3.eth.Contract(tokenABI, tokenAddress);
        
        // Получаем баланс токенов
        const balance = await contract.methods.balanceOf(userAddress).call();
        const formattedBalance = web3.utils.fromWei(balance, 'ether'); // Преобразуем в удобочитаемый формат
        tokenBalanceElement.textContent = `Balance: ${formattedBalance} USDT`;

        // Получаем стоимость токенов в долларах (например, через CoinGecko API)
        const priceInUSD = await getTokenPriceInUSD();
        usdBalanceElement.textContent = `Balance in USD: $${(formattedBalance * priceInUSD).toFixed(2)}`;
    }

    // Функция для получения цены токена (можно использовать API CoinGecko или другой источник)
    async function getTokenPriceInUSD() {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd");
        const data = await response.json();
        return data.tether.usd; // Возвращаем цену токена
    }
});
