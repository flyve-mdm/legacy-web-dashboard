// import axios from 'axios'

module.exports = function (id, password, history) {
    if (navigator.credentials) {
        navigator.credentials.get({
            password: true,
            unmediated: false
        })
            .then(function(cred) {
                if (cred) {
                    console.log(cred)
                }
            })
    }
    return null
}