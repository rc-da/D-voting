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

        // Now send the POST request with the data
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
        // console.log(updatedData);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
});