import { combineReducers } from 'redux'
import ContactBook from './ContactBook/DuckController'
import Login from './Login/DuckController'

export default combineReducers ({
    ContactBook,
    Login
})