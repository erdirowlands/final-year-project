const { expectRevert } = require("openzeppelin-test-helpers");
const  asciiToHex  = require('web3-utils');

const BigNumber = web3.BigNumber;

// const UniversityVoting = artifacts.require("UniversityVoting");
const ApprovalQueue = artifacts.require("ApprovalQueue");



require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("ApprovalQueue", accounts => {

    let approvalQueue;

    const developerAccount = accounts[0];
    const prospectiveAdminAccount = accounts[1];

    const exampleApprovalType = "institutionApprovalRequest";
    const exampleApprovalData = ["Ulster University", "Bob", "Abbot"];
  //  let test = [exampleApprovalData.map((exampleApprovalData) => web3.utils.asciiToHex(exampleApprovalData)) = asciiToHex(exampleApprovalData)]

    describe("Carry out operations on the Approval Queue", function() {
      before(async function() {
        approvalQueue = await ApprovalQueue.new({ from: developerAccount });
      });

      it("submits a new aproval request", async function() {
        const transactionReceipt = await approvalQueue.submitApprovalRequest(
          exampleApprovalType,
          exampleApprovalData.map((exampleApprovalData) => asciiToHex.toHex(exampleApprovalData), 32),
          { from: prospectiveAdminAccount }
        );
        
      });


    });
});