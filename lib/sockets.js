(function () {
  'use strict';

  /* lookup is a map from service names to port numbers. Upon service init,
   * the sockets object gains a key for the service port number. The object
   * sockets[port] must have (at least) the following keys:
   *
   *     wsmap - maps ws ID to ws object
   *     wsdata - maps ws ID to service data
   *     counter - next ws ID
   */
  var sockets = {
	  lookup: {},
  };
  module.exports = sockets;
}());
