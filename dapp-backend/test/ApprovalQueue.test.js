const { expectRevert } = require("openzeppelin-test-helpers");

const BigNumber = web3.BigNumber;

// const UniversityVoting = artifacts.require("UniversityVoting");
const ApprovalQueue = artifacts.require("ApprovalQueue");

const developerAccount = accounts[0];
const prospectiveAdminAccount = accounts[1];


require("chai")
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("ApprovalQueue", accounts => {

    let approvalQueue;

    const exampleApprovalType = "institutionApprovalRequest"
    const exampleApprovalData = ["Ulster University", "Bob", "Abbot"]

    describe("Carry out operations on the Approval Queue", function() {
      before(async function() {
        approvalQueue = await ApprovalQueue.new({ from: developerAccount });
      });

      it("submits a new aproval request", async function() {
        const transactionReceipt = await approvalQueue.submitApprovalRequest(
          exampleApprovalType,
          exampleApprovalData,
          adminSurname,
          { from: prospectiveAdminAccount }
        );
      });


    });
});