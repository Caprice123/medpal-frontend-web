export const USER_KEY = 'user'
export const TOKEN_KEY = 'token'
export const PERMISSION_KEY = 'permissions'
export const ROLE_KEY = 'roles'

export function setUser(user) {
   localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function setToken(token) {
   localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

export function setRoleData(role) {
    localStorage.setItem(ROLE_KEY, JSON.stringify(role))
}

export function getToken() {
    try{
        const payload = JSON.parse(localStorage.getItem(TOKEN_KEY) || "")
        return payload
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
        return null
    }
}

export function getUserData() {
    try{
        const payload = JSON.parse(localStorage.getItem(USER_KEY) || "")
        return payload
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
        return null
    }
}

export function getPermissionData() {
    try {
        const payload = JSON.parse(localStorage.getItem(PERMISSION_KEY) || "")
        return payload
    // eslint-disable-next-line no-unused-vars
    } catch(err) {
        return null
    }
}

export function getRoleData() {
    try {
        const payload = JSON.parse(localStorage.getItem(ROLE_KEY) || "")
        return payload
    // eslint-disable-next-line no-unused-vars
    } catch(err) {
        return null
    }
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY)
}

export function removeRoleData() {
    localStorage.removeItem(ROLE_KEY)
}

export function removeUser() {
    localStorage.removeItem(USER_KEY)
 }
 