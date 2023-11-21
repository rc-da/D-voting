document.addEventListener("DOMContentLoaded", function () {
    fetch('/database')
        .then(response => response.json())
        .then(data => {
            const allgroup = data.allgroup;
            if (allgroup) {
                Object.keys(allgroup).forEach(groupKey => {
                    const group = allgroup[groupKey];
                    addGroup(group);
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

        if (group.pollStatus) {
            const li5 = document.createElement("li");
            li5.textContent = group.pollStatus;
            li5.id = "status"
            ul.appendChild(li5);
          }
  
        newGroup.appendChild(ul);
        newGroup.addEventListener("click", async function(){
            const booth = document.getElementById("booth");
            try {
                if (typeof window.ethereum !== 'undefined') {
                  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                  const web3 = new Web3(window.ethereum);
                  const data = await interact(web3, accounts[0], group.contractAddress);
                  const options = [group.option1, group.option2, group.option3];
                  pieChart(data, options);
                  pieChart2(data, options);
                } else {
                  alert('Please install MetaMask or another Ethereum wallet extension.');
                }
              } catch (error) {
                console.error('Error connecting to MetaMask:', error);
              }
              booth.style.display = 'flex';
        })
        allGroup.appendChild(newGroup);
    }
  });

  async function interact(web3 , account, contractAddress){
    try {
        
        const abiResponse = await fetch('/abi/voteContract');

        if (!abiResponse.ok) {
          throw new Error('Failed to fetch ABI');
        }

        const cont = await abiResponse.json();
        const contractABI = cont.abi;
        const address = contractAddress;
        const instance = await new web3.eth.Contract(contractABI, address);
        const data = await instance.methods.results().call({ from: account});
        console.log(data);
        return data;
      } catch (error) {
        console.error('Error during interaction:', error);
      }
}

function pieChart(chartData, options){
    const ctx = document.getElementById('PieChart');
    const myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [options[0], options[1], options[2]], 
            datasets: [{
                data: chartData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 205, 86, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 205, 86, 1)',
                ],
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });
  
}

function pieChart2(chartData, options){
    const ctx = document.getElementById('PieChart2').getContext('2d');
    const myPieChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [options[0], options[1], options[2]], 
            datasets: [{
                data: chartData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 205, 86, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 205, 86, 1)',
                ],
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });
  
}