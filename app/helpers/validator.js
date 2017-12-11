'use strict';
const schemaValidator = require('json-schema').validate;
const anyCharRegex = ".";
const emailRegex = "^(?:[\\w\\!\\#\\$\\%\\&\\'\\*\\+\\-\\/\\=\\?\\^\\`\\{\\|\\}\\~]+\\.)*[\\w\\!\\#\\$\\%\\&\\'\\*\\+\\-\\/\\=\\?\\^\\`\\{\\|\\}\\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\\-](?!\\.)){0,61}[a-zA-Z0-9]?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\\[(?:(?:[01]?\\d{1,2}|2[0-4]\\d|25[0-5])\\.){3}(?:[01]?\\d{1,2}|2[0-4]\\d|25[0-5])\\]))$";


exports.isValidEmail = function(email) {
  const schema = {
    "type": "object",
    "properties": {
      "email": {
        "type": "string",
        "pattern": emailRegex,
        "required": true
      }
    }
  }

  return schemaValidator({ email: email }, schema).valid;
}

exports.validateRegistrationDetails = function(input) {
  const schema = {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "pattern": anyCharRegex,
        "required": true
      },
      "username": {
        "type": "string",
        "pattern": anyCharRegex,
        "required": true
      },
      "password": {
        "type": "string",
        "minLength": 6,
        "pattern": anyCharRegex,
        "required": true
      }
    }
  }

  return schemaValidator(input, schema);
}




