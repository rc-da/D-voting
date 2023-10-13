var account = null;
        var message = 'nothing';
        var signature = null; 
    
        async function messageSign() {
            try {
                if (!account) {
                    alert("Please connect your wallet first.");
                    return;
                }
                const web3 = new Web3(window.ethereum);
                signature = await web3.eth.personal.sign(message, account);
                console.log("Signature: " + signature);
                try {
                const web3 = new Web3(window.ethereum);
                const accountCheck = await web3.eth.personal.ecRecover(message, signature);
                console.log(accountCheck);
    
                const lowercaseAccountCheck = accountCheck.toLowerCase();
                const lowercaseAccount = account.toLowerCase();
    
                if (lowercaseAccountCheck === lowercaseAccount) {
                    alert("Yeah Wallet Connected Successfully !");
                } else {
                    alert("Sorry Wallet is not Connected !!");
                }
            } catch (error) {
                console.log("Error:", error);
            }
            } catch (error) {
                console.log("Error:", error);
            }
        }
    
        async function connectwallet() {
            try {
                if (window.ethereum) {
                    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                    console.log("Connected accounts:", accounts);
                    account = accounts[0];
                    await messageSign();
                    const bt = document.getElementById("metaconnect");
                    bt.innerText = "Connected ✔️";
                    bt.style.pointerEvents = "none";
                    const bt2 = document.getElementById("connectmeta");
                    bt2.innerText = "Connected ✔️";
                    bt2.style.pointerEvents = "none";
                } else {
                    alert("MetaMask is not installed !!");
                }
            } catch (error) {
                console.log("Error:", error);
            }
        }