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
        const bt = document.createElement("button")
        bt.textContent = "Submit"
        bt.className = "bt"
        
        const li1 = document.createElement("li");
        li1.textContent = group.groupQuestion;

        const li2 = document.createElement("li");
        const rad1 = document.createElement("input")
        rad1.type = "radio"
        rad1.name = "option1"
        rad1.value = 1
        const lab1 = document.createElement("label")
        lab1.innerHTML = group.option1
        lab1.setAttribute("for", "option1")
        li2.appendChild(rad1)
        li2.appendChild(lab1)

        const li3 = document.createElement("li");
        const rad2 = document.createElement("input")
        rad2.type = "radio"
        rad2.name = "option2"
        rad2.value = 2
        const lab2 = document.createElement("label")
        lab2.innerHTML = group.option2
        lab2.setAttribute("for", "option2")
        li3.appendChild(rad2)
        li3.appendChild(lab2)

        const li4 = document.createElement("li");
        const rad3 = document.createElement("input")
        rad3.type = "radio"
        rad3.name = "option3"
        rad3.value = 3
        const lab3 = document.createElement("label")
        lab3.innerHTML = group.option3
        lab3.setAttribute("for", "option3")
        li4.appendChild(rad3)
        li4.appendChild(lab3)

        const li5 = document.createElement("li");
        li5.appendChild(bt)
        bt.addEventListener("click", function(){
            window.alert("Vote submitted Successfully!")
            window.location.href = "index.html"
        })
        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
        ul.appendChild(li4);
        ul.appendChild(li5);
        booth.style.display = 'flex';

      })
      allGroup.appendChild(newGroup);
  }
});

