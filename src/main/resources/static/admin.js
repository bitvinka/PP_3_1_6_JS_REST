
getAllUsers();
showUser();
getRoles();
addNewUser();
editUser();

//список пользователей
function getAllUsers() {
    fetch('http://localhost:8080/api/admin/users')
        .then(function (response) {
            return response.json();
        })
        .then(function (users) {

            for (let user of users) {
                document.getElementById('userList').innerHTML += `<tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.userName}</td>
                         <td style="display: none;">${user.password}</td>
                        <td>${rolesUsers(user.roles)}</td>
                     
                        <td>
                          <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#editModal" >
                                Редактировать
                            </button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" >
                                Удалить
                            </button>
                        </td>
                    </tr>`
            }
        });
}

//аутентифицированный пользователь
function showUser() {
    fetch('http://localhost:8080/api/admin/principal')
        .then(function (response) {
            return response.json();
        })
        .then(function (user) {

            document.getElementById('principalName').innerHTML = `<b>${user.userName}</b>`
            document.getElementById('principalRole').innerHTML = `<i>${rolesUsers(user.roles)}</i>`

        });
}

//вывод списка ролей для таблицы
function rolesUsers(roles) {
    let rolesString = '';
    for (const role of roles) {
        rolesString += (role.name.toString().replace('ROLE_', '') + ', ');
    }
    rolesString = rolesString.substring(0, rolesString.length - 2);
    return rolesString;
}

//выбрать роли
function selectRoles(id) {
    let roles = [];
    let select = document.getElementById(id);
    for (let i=0; i < select.options.length; i++) {
        if(select.options[i].selected){
            roles.push({name: select.options[i].text});
        }
    }
    return roles;
}

//вывод списка ролей в форму
function getRoles() {
    fetch('http://localhost:8080/api/admin/roles')
        .then(function (response) {
            return response.json();
        })
        .then(function (roles) {
            for (let role of roles) {
                document.getElementById('roles').innerHTML +=
                    `<option value="${role.name}">${role.name}</option>`
                document.getElementById('rolesEdit').innerHTML +=
                    `<option value="${role.name}">${role.name}</option>`
                document.getElementById('rolesDelete').innerHTML +=
                    `<option value="${role.name}">${role.name}</option>`
            }
        });
}

//вытаскиваем пользователя из таблицы
function getUserOutTable(idTable, idField1, idField2, idField3, idField4, idField5) {
    //вытаскиваем пользователя
    const table = document.getElementById(idTable);
    table.addEventListener('click', function(event) {
        let row = event.target.closest('tr');
        if (row) {
            // Извлекаем данные из ячеек строки таблицы
            let userId = row.cells[0].innerText;
            let userFirstName = row.cells[1].innerText;
            let userLastName = row.cells[2].innerText;
            let userUserName = row.cells[3].innerText;
            let userPassword = row.cells[4].innerText;

            //вставляем их в модальное окно
            document.getElementById(idField1).value = userId;
            document.getElementById(idField2).value = userFirstName;
            document.getElementById(idField3).value = userLastName;
            document.getElementById(idField4).value = userUserName;
            document.getElementById(idField5).value = userPassword;

        }
    });
}


//===============Новый пользователь=======================================
function addNewUser() {
    const formNewUser = document.getElementById('formNewUser');

    formNewUser.addEventListener('submit', ev => {
        ev.preventDefault();

        fetch('http://localhost:8080/api/admin/users', {
            method: 'POST',
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: formNewUser.firstName.value,
                lastName: formNewUser.lastName.value,
                userName: formNewUser.userName.value,
                password: formNewUser.password.value,
                roles:  selectRoles('roles')
            })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Запрос на добавление отправлен');
                    formNewUser.reset();
                    document.getElementById('userList').innerHTML = '';
                    getAllUsers();
                    document.getElementById('nav-home-tab').click();


                } else {
                    response.json().then(json => {
                        console.log('Произошла ошибка при добавлении')
                        console.log('Полученный json', json)
                        json.errors.forEach(errorMsg => {
                            console.log('Выводим ошибку про ' + errorMsg)

                        })

                    })
                }
            });
    });
}


//=============Редактирование пользователя==================================================
function editUser() {
    let editForm = document.getElementById('editModal');
    getUserOutTable('tableList', 'idEdit', 'firstNameEdit', 'lastNameEdit','userNameEdit', 'passwordEdit');

    editForm.addEventListener("submit", ev => {
        ev.preventDefault();

        let data = {
            id: document.getElementById('idEdit').value,
            firstName: document.getElementById('firstNameEdit').value,
            lastName: document.getElementById('lastNameEdit').value,
            userName: document.getElementById('userNameEdit').value,
            password: document.getElementById('passwordEdit').value,
            roles:  selectRoles('rolesEdit')
        }

        fetch('http://localhost:8080/api/admin/users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })  .then(response => {
                    if (response.ok) {
                        console.log('Запрос на редактирование отправлен');
                        document.getElementById('btnEditClose').click();
                        document.getElementById('userList').innerHTML = '';
                        getAllUsers();

                    } else {
                        response.json().then(json => {
                            console.log('Произошла ошибка при добавлении')
                            console.log('Полученный json', json)


                        })
                    }
                });
    });
}

//==============Удаление пользователя======================================================

deleteUser();
function deleteUser() {
    let deleteForm = document.getElementById('deleteModal');
    getUserOutTable('tableList','idDelete', 'firstNameDelete', 'lastNameDelete', 'userNameDelete', 'passwordDelete');


    deleteForm.addEventListener("submit", ev => {
        ev.preventDefault();
        let idUser = document.getElementById('idDelete').value;
        fetch("http://localhost:8080/api/admin/users/" + idUser, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }) .then(response => {
            if (response.ok) {
                console.log('Запрос на удаление отправлен');
                document.getElementById('btnDeleteClose').click();
                document.getElementById('userList').innerHTML = '';
                getAllUsers();

            } else {
                response.json().then(json => {
                    console.log('Произошла ошибка при удалении');
                    console.log('Полученный json', json);
                })
            }
        });
    });
}
