Bugsense.Network = (function() {

  var Network = {
    getCrashURL: function(type) {
      return Bugsense.config.url + '?cacheBuster='+timestamp();
    },
    getTicksURL: function() {
      return "https://ticks.bugsense.com/"+Bugsense.get('apiKey')+"/"+Bugsense.get('uid');
    },
    sendCrash: function(data) {
      this.send(param({ data: JSON.stringify(data) }), 'POST', this.getCrashURL(), function(net) {
        if (net && net.readyState != 4) { return; }
        if (net && net.status != 200) {
          return false;
        }
        // some console.log implementations don't support multiple parameters, guess it's okay in this case to concatenate
        if ('console' in window) {
          console.log('logged 1 error to Bugsense, status: ' + net.responseText);
        }
      })
    },
    sendEvent: function(data) {
      this.send(data, 'POST', this.getTicksURL())
    },
    send: function(data, method, url, successHandler) {
      // Send the data over to Bugsense
      var net = new XMLHttpRequest();
      net.open(method, url, true );
      net.setRequestHeader('X-BugSense-Api-Key', Bugsense.config.apiKey);
      net.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      var that = this;
      net.onerror = function (a) {
        /* cache data */
        Bugsense.Cache.save(data);
      }

      if(successHandler)
        net.onreadystatechange = (successHandler)(net);

      net.send(data);
    }
  };
  return Network;
}());
