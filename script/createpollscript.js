document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".creation");
    form.addEventListener('submit', event => {
        event.preventDefault();
        const formdata = new FormData(form);
        const data = Object.fromEntries(formdata);
        const group = JSON.stringify(data);

        console.log(data);

        fetch('http://localhost:3000/allgroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(updatedData => {
            console.log(updatedData);

            // You can update the UI or handle the response as needed
        })
        .catch(error => {
            console.error('Error updating JSON data:', error);
        });
    });
});
