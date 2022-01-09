const { Finding, FindingSeverity, FindingType } = require("forta-agent");

const TRANSFEREVENT = 'event Transfer(bytes32 indexed node, address owner)';
const ensAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

const handleTransaction = async (txEvent) => {
  const findings = [];

  const events = txEvent.filterLog(TRANSFEREVENT, ensAddress);

  // create finding if gas used is higher than threshold
  events.forEach((event) => {
    findings.push(
      Finding.fromObject({
        name: "ENS Transfer",
        description: `ENS name was transferred`,
        alertId: "ENS-TRANSFER",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        metadata:{
          from: txEvent.from,
          recipient: event.args['owner'],
          node: event.args['node'],
        }
      })
    );
  });

  return findings;
};

module.exports = {
  handleTransaction
};
