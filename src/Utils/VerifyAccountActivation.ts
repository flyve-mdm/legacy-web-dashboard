import axios from 'axios'
const ACTIVE = 'registered Flyve MDM users. Created by Flyve MDM - do NOT modify this comment.'

export default (history, location?) => {
    const PROMISE = new Promise (function (resolve, reject) {
        axios({
            method: 'get',
            url: 'https://demo.flyve.org/glpi/apirest.php/getActiveProfile/'
        })
            .then((response) => {
                console.log(response)
                if (response.data.active_profile.comment !== ACTIVE) {
                    history.push('/validateaccount')
                    resolve (false)
                } else if (location) {
                    history.push(`/${location}`)
                    resolve (false)
                } else {
                    resolve (true)
                }
            })
            .catch(function (error: object) {
                history.push('/login')
                resolve (false)
            })
    })
    
    return PROMISE
}
