fetch("/database")
  .then(response => response.json())
  .then(data => {
    console.log("Data received:", data);
    const allGroup = document.getElementById("allgroup");

    if (Array.isArray(data.allgroup)) {
      data.allgroup.forEach(groupData => {
        const newGroup = createGroupElement(groupData);
        allGroup.appendChild(newGroup);
      });
    } else {
      console.error("Data format not recognized");
    }
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });

function createGroupElement({ groupImg, groupName, groupCode }) {
  const newGroup = document.createElement("div");
  newGroup.className = "group";
  const ul = document.createElement("ul");
  const img = document.createElement("img");

  img.src = groupImg;
  const li1 = document.createElement("li");
  li1.appendChild(img);

  const li2 = document.createElement("li");
  li2.textContent = groupName;

  const li3 = document.createElement("li");
  li3.textContent = groupCode;

  ul.appendChild(li1);
  ul.appendChild(li2);
  ul.appendChild(li3);

  newGroup.appendChild(ul);

  return newGroup;
}
