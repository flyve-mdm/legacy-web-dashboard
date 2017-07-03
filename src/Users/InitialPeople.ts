import GetAllUsers from '../Utils/GetAllUsers'

import Data from './FakeData'
const WinJS = require('winjs')

export default function () {

    const PROMISE = new Promise (function (resolve, reject) {
        let groupKey = function (data) {
            return data.name[0].toUpperCase()
        }

        let groupData = function (data) {
            return { title: groupKey(data) }
        }

        let sorter = function (a, b) {
            if (a.name < b.name) {
                return -1
            } else if (a.name > b.name) {
                return 1
            } else {
                return 0
            }
        }
        GetAllUsers()
            .then((response) => {
                resolve (
                    new WinJS.Binding.List(Data)
                        .createSorted(sorter)
                        .createGrouped(groupKey, groupData)
                )
            })
            .catch((error) => {
                resolve (
                    new WinJS.Binding.List(Data)
                        .createSorted(sorter)
                        .createGrouped(groupKey, groupData)
                )
            })
    })
    return PROMISE
}