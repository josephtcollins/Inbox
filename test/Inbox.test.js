const assert = require('assert');
const ganache = require('ganache-cli');
// single instance connects to one ethereum network
const Web3 = require('web3'); 
// this will change over time to the relevant network (rinkeby eg)
const web3 = new Web3(ganache.provider()); 
const {interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
  // get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // use an account to deploy a contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!']})
    .send({ from: accounts[0], gas: '1000000' })
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, 'Hi there!');
  });

  it('can change the message', async () => {
    const hash = await inbox.methods.setMessage('new message').send({ from: accounts[0] })
    console.log(hash);
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, 'bye')
  });
})
