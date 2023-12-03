const addForm = document.getElementById('addForm');
const cardContainer = document.getElementById('card-container');
let myAccount = { };

axios
.get('/set-myaccount')
.then((response) => {
    myAccount = response.data;
    document.getElementById('my-login').innerText = myAccount.login;
    addForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        let formData = new FormData(addForm);
        const appName = formData.get('appName');
        const appLogin = formData.get('appLogin');
        const appPassword = formData.get('appPassword');
        const appEmail = formData.get('appEmail');
        const accountLogin = myAccount.login;

        const postData = { appName, appLogin, appPassword, appEmail, accountLogin };
    
        axios
        .post('/add-password', postData)
        .then((response) => {
            console.log(response);
            addForm.reset();
            alert('Password added');
            getData();
        })
        .catch((error) => {
            console.error(`Error posting data: ${error}`);
        });
    
    });
    function getData() {
        axios
        .post('/get-passwordsinfo')
        .then((response) => {
            let data = response.data.reverse();
            let sortedDataByAppName = [...data].sort((a, b) => a.appName.localeCompare(b.appName, undefined, { sensitivity: 'base' }));
            let sortedDataByAppLogin = [...data].sort((a, b) => a.appLogin.localeCompare(b.appLogin, undefined, { sensitivity: 'base' }));
            getList(data)
            function getList(data) {
                cardContainer.innerHTML = '';
                for(let el of data) {
                let card = document.createElement('div');
                card.classList.add('password-card');
                card.classList.add(`card_${el.appName}`);
                card.innerHTML = `
                    <div class="checkBox"></div>
                    <h2 class="card-h2-1">${el.appName}</h2>
                    <span class="card-span-1">
                        <h2 class="card-h2-2">${el.appLogin}</h2>
                        <p class="card-p-1">${el.appEmail}</p>
                    </span>
                    <span class="card-span-2">
                        <input class="card-input" type="password" value="${el.appPassword}" readonly>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#1f2937" class="card-eye w-8 h-8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </span>
                `;
                const cardeye = card.querySelector('.card-eye');
                const input = card.querySelector('input');
                cardeye.addEventListener('click', () => {
                    input.type = input.type === 'password' ? 'text' : 'password';
                });
                cardContainer.append(card);
                }
                const checkBoxes = document.querySelectorAll('.checkBox');
                checkBoxes.forEach(function(checkBox) {
                    checkBox.addEventListener('click', function() {
                        const currentContent = this.innerHTML;
                        if (currentContent.includes('<i class="fa-solid fa-check"></i>')) {
                            this.innerHTML = '';
                        } else {
                            this.innerHTML = '<i class="fa-solid fa-check"></i>';
                        }
                    });
                });
                document.getElementById('deleteBtn').addEventListener('click', function() {
                let delArr = [];
                checkBoxes.forEach(function(checkBox) {
                    if(checkBox.innerHTML != '') {
                        let thisName = checkBox.closest('.password-card').className.split('card_')[1];
                        delArr.push(thisName);
                        checkBox.closest('.password-card').remove();
                    }else { }
                });
                axios
                .post('/delete-passwords', { delArr, myAccount } )
                .then((response) => {
                    delArr = [];
                    console.log()
                })
                .catch((error) => {
                    console.error(`Error posting data: ${error}`);
                })
                })
            }
            document.getElementById('filterByDate').addEventListener('click', function() {
                    getList(data);
            });
            document.getElementById('filterByAppName').addEventListener('click', function() {
                    getList(sortedDataByAppName);
            });
            document.getElementById('filterByAppEmail').addEventListener('click', function() {
                    getList(sortedDataByAppLogin);
            });
            const filterItems = document.querySelectorAll('.filter-item');
            filterItems.forEach(item => {
                item.addEventListener('click', function() {
                    filterItems.forEach(item => {
                        item.style.backgroundColor = 'transparent';
                        item.style.color = '#000';
                    });
                    this.style.backgroundColor = '#333';
                    this.style.color = '#fff';
                });
            });
        })
        .catch((error) => {
            console.error(`Error getting info: ${error}`);
        }) 
    }
    getData();
})
.catch((error) => {
    console.error(`Error getting data from server: ${error}`);
});


document.getElementById('show-passwordlist').addEventListener('click', () => {
    document.getElementById('card-wrapper').style.display = 'flex';
    document.getElementById('addForm-wrapper').style.display = 'none';
    document.getElementById('page-text').innerText = 'Password list';
});
document.getElementById('show-createpassword').addEventListener('click', () => {
    document.getElementById('card-wrapper').style.display = 'none';
    document.getElementById('addForm-wrapper').style.display = 'flex';
    document.getElementById('page-text').innerText = 'Create password';
});
document.getElementById('log-out').addEventListener('click', () => {
    window.location.href = '/';
});

const filterBtn = document.getElementById('filterBtn');
const filterContainer = document.getElementById('filterContainer');

filterBtn.addEventListener('click', function() {
    if (filterContainer.style.display === 'none' || filterContainer.style.display === '') {
        filterContainer.style.display = 'block';
    } else {
        filterContainer.style.display = 'none';
    }
});