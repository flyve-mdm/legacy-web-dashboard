export default (id, password, history) => {
    navigator.credentials.get({
        password: true,
        unmediated: true
    })
        .then(function(cred) {
            if (cred) {
                console.log(cred)
                // Use provided credential to sign user in  
            }
        })
    return null
}