const xrpl = require("xrpl");

document.getElementById("transactions3").onclick = () => {
  main();
};
async function main() {
  const client = new xrpl.Client("wss://xrplcluster.com/");
  await client.connect();
  let transactions = [];

  const consulta = {
    command: "account_tx",
    account: transactions2.value,
    ledger_index_min: -1,
    ledger_index_max: -1,
    binary: false,
    limit: 200,
    forward: false,
  };
  let response = await client.request(consulta);

  console.log(response.result.transactions);
  document.getElementById("transactions4").value = JSON.stringify(
    response.result.transactions,
    null,
    2
  );
  if (response?.result?.transactions) {
    transactions = transactions.concat(response?.result?.transactions);

    //check for marker
    let i = 0;
    if (response.result.marker) {
      while (response.result.marker) {
        consulta.marker = response.result.marker;
        consulta.ledger_index = response.result.ledger_index;

        console.log("additional calls: " + ++i);

        response = await client.request(consulta);

        if (response?.result?.transactions) {
          transactions = transactions.concat(response?.result?.transactions);
        }
        console.log(transactions);
        document.getElementById("transactions4").value = JSON.stringify(
          transactions,
          null,
          2
        );
      }
    }
  }
  client.disconnect();
  document.getElementById("clear").onclick = () => {
    window.location.reload();
  };
}
main();
