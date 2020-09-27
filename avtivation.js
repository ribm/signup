var crypto = require('crypto');


var ciphertext = crypto.AES.encrypt('my message', 'secret key 123').toString();



