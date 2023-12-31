document.addEventListener("DOMContentLoaded", function () {
  fetch('/database')
      .then(response => response.json())
      .then(data => {
          const allgroup = data.allgroup;
          if (allgroup) {
              Object.keys(allgroup).forEach(groupKey => {
                  const group = allgroup[groupKey];
                  if(group.pollStatus == "Open"){
                  addGroup(group);}
              });
          } else {
              console.error("Missing 'allgroup' property in the JSON data.");
          }
      })
      .catch(error => {
          console.error("Error fetching data:", error);
      });

  function addGroup(group) {
      const allGroup = document.getElementById("allgroup");
      if (!allGroup) {
          console.error("Element with ID 'allgroup' not found");
          return;
      }

      const newGroup = document.createElement("div");
      newGroup.className = "group";
      const ul = document.createElement("ul");

      var img = document.createElement("img");
      img.src = "../img/cat.jpg";
      const li1 = document.createElement("li");
      li1.appendChild(img);
      ul.appendChild(li1);

      if (group.groupName) {
          const li2 = document.createElement("li");
          li2.textContent = group.groupName;
          ul.appendChild(li2);
      }

      if (group.groupCode) {
          const li4 = document.createElement("li");
          li4.textContent = group.groupCode;
          ul.appendChild(li4);
      }

      // if (group.pollStatus) {
      //   const li5 = document.createElement("li");
      //   li5.textContent = group.pollStatus;
      //   li5.id = "status"
      //   ul.appendChild(li5);
      // }
      
      newGroup.appendChild(ul);
      newGroup.addEventListener("click", async function(){
        const secretKey = window.prompt("Secret Key")
        group = decrypt(group, secretKey)
        const booth = document.getElementById("booth");
        const ul = document.getElementById("content")
        const bt = document.createElement("button")
        bt.textContent = "Submit"
        bt.className = "bt"

        const bt2 = document.createElement("button")
        bt2.textContent = "Close Poll"
        bt2.className = "bt2"
        
        const li1 = document.createElement("li");
        li1.textContent = group.groupQuestion;

        const li2 = document.createElement("li");
        const rad1 = document.createElement("input")
        rad1.type = "radio"
        rad1.name = "option"
        rad1.id = "option1"
        rad1.value = 0
        const lab1 = document.createElement("label")
        lab1.innerHTML = group.option1
        lab1.setAttribute("for", "option1")
        li2.appendChild(rad1)
        li2.appendChild(lab1)

        const li3 = document.createElement("li");
        const rad2 = document.createElement("input")
        rad2.type = "radio"
        rad2.name = "option"
        rad2.id = "option2"
        rad2.value = 1
        const lab2 = document.createElement("label")
        lab2.innerHTML = group.option2
        lab2.setAttribute("for", "option2")
        li3.appendChild(rad2)
        li3.appendChild(lab2)

        const li4 = document.createElement("li");
        const rad3 = document.createElement("input")
        rad3.type = "radio"
        rad3.name = "option"
        rad3.id = "option3"
        rad3.value = 2
        const lab3 = document.createElement("label")
        lab3.innerHTML = group.option3
        lab3.setAttribute("for", "option3")
        li4.appendChild(rad3)
        li4.appendChild(lab3)

        let voteOption;

        rad1.addEventListener("change", function () {
          if (rad1.checked) {
              voteOption = rad1.value;
          }
        });

        rad2.addEventListener("change", function () {
            if (rad2.checked) {
                voteOption = rad2.value;
            }
        });

        rad3.addEventListener("change", function () {
            if (rad3.checked) {
                voteOption = rad3.value;
            }
        });

        const li5 = document.createElement("li");
        li5.appendChild(bt);

        bt.addEventListener("click", async function(){
            try {
                if (typeof window.ethereum !== 'undefined') {
                  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                  const web3 = new Web3(window.ethereum);
                  console.log("MetaMask Connected Accounts:", accounts);
                  console.log("vote option", voteOption)
                  const toVote = "vote"
                  await interact(web3, accounts[0], group.contractAddress, voteOption, toVote);
                  
                } else {
                  alert('Please install MetaMask or another Ethereum wallet extension.');
                }
              } catch (error) {
                console.error('Error connecting to MetaMask:', error);
              }
            
        })

        const li6 = document.createElement("li");
        li6.appendChild(bt2);
        li6.style.display = "none";
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const voter =  accounts[0];
        console.log("before closing", group.owner)
        if(voter == group.owner)
        {
          li6.style.display = "block"
        }

      bt2.addEventListener("click", async function(){
        try {
          if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);
            const toClose = "close"
            await interact(web3, accounts[0], group.contractAddress, voteOption, toClose);
            const data = await fetch("/database");
            const dataJson = await data.json();
            const groupToUpdate = dataJson.allgroup[group.groupCode];
            
            if (groupToUpdate) {
              groupToUpdate.pollStatus = "Close";
              const dataUpdate = dataJson.allgroup[group.groupCode]
              const postData = {
                jsonContent: dataUpdate,
                textContent: group.groupCode,
              };
            
              await fetch('/database', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
              });
            } else {
              console.error(`Group with code ${group.groupCode} not found.`);
            }
            
            
            window.alert("Poll closed Successfully!")
            window.location.href = "index.html"
          } else {
            alert('Please install MetaMask or another Ethereum wallet extension.');
          }
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      })


        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
        ul.appendChild(li4);
        ul.appendChild(li5);
        ul.appendChild(li6);
        booth.style.display = 'flex';

      })
      allGroup.appendChild(newGroup);
  }
});

async function interact(web3 , account, contractAddress, voteOption, action){
    try {
        
        const abiResponse = await fetch('/abi/voteContract');

        if (!abiResponse.ok) {
          throw new Error('Failed to fetch ABI');
        }

        const cont = await abiResponse.json();
        // console.log("abi in json", cont)
        const contractABI = cont.abi;
        const address = contractAddress;
        const instance = await new web3.eth.Contract(contractABI, address);

        if(action == "vote"){
        const option = voteOption;
        await instance.methods.vote(option).send({ from: account});
        window.alert("Vote submitted Successfully!")
        }

        if(action == "close"){
        await instance.methods.close().send({ from: account});
        alert("Poll closed successfully!!")
        }

        console.log(await instance.methods.results().call({ from: account}));
        
        window.location.href = "index.html"
      } catch (error) {
        console.error('Error during interaction:', error);
      }
}

async function searchedPoll(){
  const searched = document.getElementById("search").value
  const responseJson = await fetch("/database")
  const jsonData = await responseJson.json()
  // console.log("jsondata", jsonData.allgroup[searched])
}

function decrypt(group, secretKey){
  try{
  const keys = CryptoJS.enc.Utf8.parse(secretKey);
  const dataKeys = Object.keys(group);
  dataKeys.forEach((key) => {
    if (key == "groupQuestion" || key == "option1" || key == "option2" || key == "option3") {
      const decrypted = CryptoJS.AES.decrypt(group[key], keys, { mode: CryptoJS.mode.ECB });
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      group[key] = decryptedString
      console.log(group[key], decryptedString, "decrypt values");
    }
  });
  console.log("before retrunning", group)
  return group;
}catch{
  // window.alert("Wrong secret Key")
}
}
