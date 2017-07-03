import axios from 'axios'

export default (sessionToken: string) => {
    axios.defaults.headers.common['Session-Token'] = sessionToken
}
