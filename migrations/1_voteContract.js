const vote = artifacts.require("./contracts/voteContract.sol");

module.exports = function(deployer){
    deployer.deploy(vote)
}