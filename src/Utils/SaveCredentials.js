import VerifyAccountActivation from './VerifyAccountActivation'

export default (id, password, history) => {
    var c = new PasswordCredential({
        id,
        password
    })

    navigator.credentials.store(c)
        .then(function() {
            VerifyAccountActivation(history, 'users')
        })
    return null
}