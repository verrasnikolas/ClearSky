const revokedTokens = new Set();

const addRevokedToken = (token) => {
    revokedTokens.add(token);
};

const isTokenRevoked = (token) => {
    return revokedTokens.has(token);
};

module.exports = { addRevokedToken, isTokenRevoked };
