var ViewComponent   = require('../_base/viewcomponent'),
    Radio           = require('backbone.radio'),
    View            = require('./views/signup'),
    Model           = require('./models/user'),
    ZeroNetManager  = require('../utilities/zeronet'),
    appChannel      = Radio.channel('app'),
    zeronet,
    _self;

module.exports = ViewComponent.extend({
  channelName: 'signup',
  initialize: function (options) {
    _self = this;

    _self.model = new Model();
    _self.view = new View({model: _self.model });

    if (options && options.zeroNetManager) {
      zeronet = options.zeroNetManager;
    } else {
      zeronet = appChannel.request('service:get', { name: 'zeronet', serviceClass: ZeroNetManager });
    }

    _self
      .getParentComponent().showView(_self.getView());

    zeronet
      .getSiteInfo()
      .then(function (siteInfo) {
        _self.btcAddress = siteInfo.auth_address;
        _self.model.set('btcAddress', siteInfo.auth_address);
        _self.getChannel().trigger('success:btc:get', siteInfo.auth_address, qrPublic);
      });
  },
  radioEvents: {
    'user:create': 'createUser'
  },
    
  createUser: function (options) {
    
    var filePath = 'data/users/' + _self.model.get('btcAddress') + '/user.json';

    // 1. sign user address, plus cert type, plus user address (again) in base64
    //    using site's user content address private key
    var textToSign = _self.model.get('btcAddress') + '#web/' + _self.model.get('userName'),
        cert = currency
          .btcSignMessage(_self.contentAddress, textToSign)
          .toDER()
          .toString('base64');

    return zeronet.addCertificate(cert, _self.model.get('userName'))
      .then(function (response) {
        // 2. write the model to the file system
        var fileContent = btoa(unescape(encodeURIComponent(JSON.stringify(_self.model.toJSON(), null, '  '))));
        return zeronet.writeFile(filePath, fileContent);
      })
      .then(function (response) {
        return zeronet.publish(filePath);
      })
      .then(function (response) {
        console.log(response);
        // 3. handle errors or process notifications
      });
  }
});
 
