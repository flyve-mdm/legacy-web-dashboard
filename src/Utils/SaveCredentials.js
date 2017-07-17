module.exports = function (id, password, callback) {
    var c = new PasswordCredential({
        id,
        password
    })

    if (navigator.credentials) {
        navigator.credentials.store(c)
            .then(function() {
                callback()
            }) .catch(function() {
                callback()
            })
    } else {
        callback()
    }
    
    return null
}