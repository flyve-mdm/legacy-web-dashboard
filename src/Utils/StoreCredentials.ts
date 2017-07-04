import VerifyAccountActivation from './VerifyAccountActivation'
import { Navigator, Credential } from '../Interface/Navigator'

export default function (id: string, password: string, history: any, name?: string, type?: string) {

    let navi: Navigator = navigator
    if (navi.credentials) {
        let cre: Credential = {id, password, name: 'gian', type: 'password'}
        navi.credentials.store(cre)
        .then(() => {
            VerifyAccountActivation(history, 'contactbook')
        })
    }
    
}