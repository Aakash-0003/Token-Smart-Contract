const Token = artifacts.require("Token");

module.exports = function (deployer) {
    deployer.deploy(Token, 'Streax', 'STX', 10, 50000000000000);
};