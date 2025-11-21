const saveAccessToken = (token) => {
    localStorage.setItem("token", token);
    console.log("Token saved:", token);
}

const getAccessToken = () => {
    const token = localStorage.getItem("token");
    return token;
}

const removeAccessToken = () => {
    localStorage.removeItem("token");
}

export {
    saveAccessToken,
    getAccessToken,
    removeAccessToken
}