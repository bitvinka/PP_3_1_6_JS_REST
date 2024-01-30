
getUser();
function getUser() {
    function rolesUsers(roles) {
        let rolesString = '';
        for (const role of roles) {
            rolesString += (role.name.toString().replace('ROLE_', '') + ', ');
        }
        rolesString = rolesString.substring(0, rolesString.length - 2);
        return rolesString;
    }
    fetch('http://localhost:8080/api/user')
        .then(function (response) {
            return response.json();
        })
        .then(function (principal) {
            document.getElementById('principalName').innerHTML = `<b>${principal.userName}</b>`
            document.getElementById('principalRole').innerHTML = `<i>${rolesUsers(principal.roles)}</i>`

            document.getElementById('user').innerHTML += `<tr>
                    <td>${principal.id}</td>
                    <td>${principal.firstName}</td>
                    <td>${principal.lastName}</td>
                    <td>${principal.userName}</td>
                    <td>${rolesUsers(principal.roles)}</td>
                </tr>`
        });
}
