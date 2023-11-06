document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".creation");
    form.addEventListener('submit', event => {
      event.preventDefault();
      const formdata = new FormData(form);
      const data = Object.fromEntries(formdata);
  
      console.log(data);
  
      fetch('/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => {
        if (!response.ok) {
          console.error('Server responded with an error. Status:', response.status);
          return response.text().then(text => {
            console.error('Response body:', text);
            throw new Error('Network response was not ok');
          });
        }
        return response.json();
      })
      .then(updatedData => {
        console.log(updatedData);
      })
      .catch(error => {
        console.error('Error updating JSON data:', error);
      });
    });
  });
  