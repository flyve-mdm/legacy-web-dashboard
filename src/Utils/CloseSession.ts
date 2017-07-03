import ChangeSessionToken from './ChangeSessionToken'
import axios from 'axios'

export default (history) => {
    axios({
        method: 'get',
        url: 'https://dev.flyve.org/glpi/apirest.php/killSession/'
    })
        .then((response) => {
            console.log(history)
            ChangeSessionToken('')
            history.push('/')
        })
        .catch(function (error: object) {
            console.log(error)
        })
}