const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const Create = await hre.ethers.getContractFactory("Create");

  // Deploy the contract
  const create = await Create.deploy();
  await create.deployed();

  console.log("CONTRACT_ADDRESS:", create.address);

  // Fetching and displaying initial contract details after deployment
  try {
    const electionEnded = await create.electionEnded();
    console.log("Is Election Ended?", electionEnded);

    if (electionEnded) {
      const winner = await create.getWinner();
      console.log(`Winner: ${winner.name} with ${winner.votes} votes`);

      const votedVoters = await create.getVotersWhoVoted();
      console.log("Voters who voted:", votedVoters);

      const nonVoters = await create.getVotersWhoDidNotVote();
      console.log("Voters who didn't vote:", nonVoters);
    } else {
      console.log("Election is still ongoing...");
    }
  } catch (error) {
    console.error("Error fetching contract details:", error);
  }
}

// Deployment command examples
// npx hardhat run scripts/deploy.js --network polygon_amoy
// npx hardhat run scripts/deploy.js --network localhost

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
