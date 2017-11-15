const jayson = require('jayson')
let server = jayson.server({

  /**
   * Returns a BlockchainUser Schema object derived from SubTXs registered on the blockchain
   * @param uname {string} BlockchainUser name
   * @memberof DashDrive
   */
  getBlockchainUser(args, callback) {
    callback(null, args["name"])
  },

  /**
   * Get changes to a user's state since height
   * @param uname {string} BlockchainUser name
   * @param height {number} Height to check since
   * @memberof DashDrive
   */
  getBlockchainUserStateSinceHeight(args, callback) {
    callback(null, "name: " + args["name"] + ", height: " + args["height"])
  },

  /**
   * Returns the current data state for a BU on a given Dap schema, that is resolved by relpaying packets of a BU up to the last transition on the blockchain
   * @param uname {string} Blockchain username
   * @param dapid {string} Hash of the DAP Schema
   * @memberof DashDrive
   */
  getBlockchainUserState(args, callback) {
    callback(null, "name: " + args["name"] + ", dapid: " + args["dapid"])
  },

  /**
   * Returns a DAP Schema registered in DashDrive by id
   * DAP Schemas have null dapids in their containing DAP Object to signify they are within the Platform DAP (constituting a DAP definition not a certain DAP's data)
   * @param dapid {string} Hash of the DAP Schema
   * @memberof DashDrive
   */
  getDapSchema(args, callback) {
    callback(null, "dapid: " + args["dapid"])
  }

})

var bind_host = process.env.BIND_HOST || '0.0.0.0';
server.http().listen(5001, bind_host)

// break on ^C
process.on('SIGINT', function() {
  process.exit();
});