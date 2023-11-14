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

      newGroup.appendChild(ul);
      newGroup.addEventListener("click", function(){
        const booth = document.getElementById("booth");
        const ul = document.getElementById("content")

        const li1 = document.createElement("li");
        li1.textContent = group.groupQuestion;
        const li2 = document.createElement("li");
        li2.textContent = group.option1;
        const li3 = document.createElement("li");
        li3.textContent = group.option2;
        const li4 = document.createElement("li");
        li4.textContent = group.option3;
        
        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
        ul.appendChild(li4);
        booth.style.display = 'flex';

      })
      allGroup.appendChild(newGroup);
  }
});

