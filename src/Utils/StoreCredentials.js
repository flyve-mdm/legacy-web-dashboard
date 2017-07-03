// import VerifyAccountActivation from './VerifyAccountActivation'

module.export = function (id, password, history) {
    var c = new PasswordCredential({
        id,
        password
    })

    console.log(c)

    navigator.credentials.store(c)
    // .then(() => {
    //     // VerifyAccountActivation(history, 'contactbook')
    // })
}