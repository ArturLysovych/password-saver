const form = document.querySelector('.regForm');

form.addEventListener('click', (event) => {
    event.preventDefault();
    axios
    .post('/account')
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error(`ERROR: ${error}`);
    })
});