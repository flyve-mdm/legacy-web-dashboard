import { combineReducers } from 'redux'
import Users from './Users/DuckController'
import Login from './Login/DuckController'

export default combineReducers ({
    Users,
    Login
})