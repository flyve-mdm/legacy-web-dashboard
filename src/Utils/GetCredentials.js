import axios from 'axios'

export default (id, password, history) => {
    navigator.credentials.get({
        password: true,
        unmediated: false
    })
        .then(function(cred) {
            if (cred) {
                console.log(cred)

                // var req = new Request(request.url, {
                //     method: request.method,
                //     headers: request.headers,
                //     mode: 'same-origin', // need to set this properly
                //     credentials: request.credentials,
                //     redirect: 'manual'   // let browser handle redirects
                // })



                // fetch('http://n1jolfx3b3pb.runscope.net', {          
                //     method: 'POST',      
                //     credentials: cred    
                // }).then(function(response) {
                //     console.log(response)
                // })




                // axios({
                //     method: 'post',
                //     url: 'http://n1jolfx3b3pb.runscope.net',
                //     auth: {
                //         username: cred.login,
                //         password: cred.password
                //     }
                // })
                //     .then((response) => {
                //         console.log(response)
                //     })
                //     .then((error) => {
                //         console.log(error.response)
                //     })





                // axios.post ('https://dev.flyve.org/glpi/apirest.php/initSession', cred)  
                //     .then((response) => {
                //         console.log(response)
                        
                //         this.props.changeLoading('')
                //         ChangeSessionToken(response.data.session_token)
                //         // VerifyAccountActivation(this.props.history, 'users')
                //     })
            }
        })
    return null
}