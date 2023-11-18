document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".creation");

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const formdata = new FormData(form);
    const dataJSON = Object.fromEntries(formdata);

    fetch('/database')
      .then(response => response.json())
      .then(data => {
        const keysLength = Object.keys(data.allgroup).length + 1;
        dataJSON.groupCode = keysLength;
        const postData = {
          "jsonContent": dataJSON,
          "textContent": keysLength
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