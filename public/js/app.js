const form = document.getElementById('form');
const changeLog = document.getElementById('change-log');
const changeReg = document.getElementById('change-reg');
const logQuest = document.getElementById('log-quest');
const regQuest = document.getElementById('reg-quest');

let formChecker = 'reg';

changeLog.addEventListener('click', function() {
    formChecker = 'log';
    logQuest.style.display = 'none';
    regQuest.style.display = 'block';
});
changeReg.addEventListener('click', function() {
    formChecker = 'reg';
    logQuest.style.display = 'block';
    regQuest.style.display = 'none';
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const login = formData.get('login');
    const password = formData.get('password');

    const postData = { login, password };

    try {
        const response = await axios.get('/get-userinfo');
        const users = response.data;

        if (formChecker == 'reg') {
            let isLoginTaken = false;

            for (let el of users) {
                if (el.login === login) {
                    isLoginTaken = true;
                    break;
                }
            }

            if (isLoginTaken) {
                alert('This login is already taken');
            } else {
                try {
                    await axios.post('/reg-submit', postData);
                    alert('User registered successfully');
                } catch (error) {
                    console.error(`Error registering user: ${error}`);
                }
            }
        }

        else if (formChecker == 'log') {            
            axios
            .post('/log-submit', postData)
            .then((response) => {
                console.log(response.data.login);
                if (password == response.data.password && login == response.data.login) {
                    alert('Login succesfully');
                    window.location.href = '/account';
                }else {
                    alert('False data');
                }
            })
            .catch((error) => {
                console.error(`Error posting data: ${error}`);
            })
        }
    } catch (error) {
        console.error(`Error getting info from server: ${error}`);
    }
});