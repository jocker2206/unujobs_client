
const login = async (token) => {
    let oldToken = await localStorage.token;
    if (oldToken != "") {
        if (token) {
            localStorage.token = token;
            return true;
        }
    }

    return false;
}


const destroy = () => {
    let token = typeof localStorage == 'object' ? localStorage : {}; 
    if (token.removeItem('token')) return true;
    return false;
}


const getToken = () => {
    return typeof localStorage == 'object' ? localStorage.token : '';
}


const refreshToken = (newToken) => {
    if (newToken) {
        typeof localStorage == 'object' ? localStorage.setItem('token', newToken) : '';
        return true;
    }

    return false;
}


const isAuth = async () => {
    if (await getToken()) {
        return true;
    }

    let local = typeof location == 'object' ? location : {};
    local.href = "/login";

    return false;
}

const isGuest = async () => {
    if (await getToken()) {
        let local = typeof location == 'object' ? location : {};
        local.href = "/";

        return false;
    }

    return true;
}


const Bearer = async () => {
    return `Bearer ${await getToken()}`
}


module.exports = {
    login,
    destroy,
    getToken,
    refreshToken,
    isAuth,
    isGuest,
    Bearer
}