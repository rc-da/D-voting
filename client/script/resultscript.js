fetch("http://localhost:3000/allgroup")
    .then(response => response.json())
    .then(data => {
        data.map(group => {
            addGroup(group)
        });
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

function addGroup({groupName, groupImg, groupCode})
{
    const allGroup = document.getElementById("allgroup")
    const newGroup = document.createElement("div")
    newGroup.className = "group"
    const ul = document.createElement("ul")
    var img = document.createElement("img")

    img.src = groupImg
    const li1 = document.createElement("li")
    li1.appendChild(img)
    
    const li2 = document.createElement("li")
    li2.textContent = groupName
    
    const li3 = document.createElement("li")
    li3.textContent = groupCode

    ul.appendChild(li1)
    ul.appendChild(li2)
    ul.appendChild(li3)

    newGroup.appendChild(ul)
    allGroup.appendChild(newGroup)    
}