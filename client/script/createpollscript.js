document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".creation");

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const formdata = new FormData(form);
    const dataJSON = Object.fromEntries(formdata);
    const data = await create()
    const owner = data["account"]
    const contractAddress = data["contractAddress"]
    console.log("owner",owner)

      fetch('/database').then(response => response.json())
      .then((databaseData) => {
        const keysLength = Object.keys(databaseData.allgroup).length + 1;
        console.log("the contract address", contractAddress)
        dataJSON.groupCode = keysLength;
        dataJSON.contractAddress = contractAddress;
        dataJSON.owner = owner;
        
        const postData = {
          "jsonContent": dataJSON,
          "textContent": keysLength,
        };

        console.log(postData);

        return fetch('/database', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
      })
      .then(postResponse => {
        if (!postResponse.ok) {
          console.error('Server responded with an error. Status:', postResponse.status);
          return postResponse.text().then(text => {
            console.error('Response body:', text);
            throw new Error('Network response was not ok');
          });
        }
        return postResponse.json();
      })
      .then(updatedData => {
        popup(updatedData)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
});

function popup(updatedData)
{
  const postInfo = document.getElementById('postInfo')
  const postContent = document.getElementById("postContent")
  const ul = document.getElementById("content")
  const key = Object.keys(updatedData.allgroup).length;
  const lastGroup = updatedData.allgroup[key];
  const li1 = document.createElement("li");
  const li2 = document.createElement("li");
  const li3 = document.createElement("li");
  const bt = document.createElement("button")
  bt.className = "startbt"
  li1.textContent = `Your Group Name :  "${lastGroup.groupName}"`
  li2.textContent =  `Your Group Code : "${lastGroup.groupCode}"`
  li3.textContent = ` Click on the Start Vote button , you will be redirected to Vote page.`
  ul.appendChild(li1);
  ul.appendChild(li2);
  ul.appendChild(li3);
  bt.textContent = "Start vote"
  bt.addEventListener('click', function(){
    window.location.href = "vote.html"
  })
  postContent.appendChild(ul)
  postContent.appendChild(bt)

  postInfo.style.display = 'flex';
}


async function create() {
  try {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);
      console.log("MetaMask Connected Accounts:", accounts);
      const data =  await deployContract(web3, accounts[0]);
      const acc = data["account"]
      const addr = data["contractAddress"]
      console.log(acc,addr)
      return data;
    } else {
      alert('Please install MetaMask or another Ethereum wallet extension.');
    }
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
  }
}


async function deployContract(web3, account) {
  try {
    const abiResponse = await fetch('/abi/voteContract');
    const { abi, bytecode } = await abiResponse.json();
    const contract = new web3.eth.Contract(abi);

    const deployedContract = await contract.deploy({
      data: bytecode,
    }).send({
      from: account,
      gas: 3000000,
    });

    const contractAddress = deployedContract.options.address;

    console.log('Contract deployed successfully');
    console.log('Account:', account);
    console.log('Contract Address:', contractAddress);

    return { account, contractAddress };
  } catch (error) {
    console.error('Error deploying contract:', error);
  }
}