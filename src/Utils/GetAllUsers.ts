import axios from 'axios'

export default () => {
    const PROMISE = new Promise (function (resolve, reject) {
        axios({
            method: 'get',
            url: 'https://dev.flyve.org/glpi/apirest.php/User/'
        })
            .then((response) => {
                resolve (response.data)
            })
            .catch((error) => {
                resolve (undefined)
            })
    })
    return PROMISE
}