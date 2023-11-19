const vote = artifacts.require("./contracts/voteContract.sol");

module.exports = async function(deployer){
    await deployer.deploy(vote)
}