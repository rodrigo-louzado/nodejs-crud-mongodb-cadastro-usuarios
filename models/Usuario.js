const mongoose = require('mongoose');
const _ = require("lodash");

const UserSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    require: true 
  },
  telefone: {
    type: String,
    required: true,
  },
  nascimento: {
    type: Date,
    required: true,
  }, 
  rg: {
    type: String,
    requied: true,
    minlength: 12,
    maxlength: 12
  },
  cpf: {
    type: String,
    requied: true,
    minlength: 14,
    maxlength: 14
  },
  endereco: {
    type: String,
    required: true,
    minlength: 1
  }, 
  cep: {
    type: String,
    requied: true,
    minlength: 9,
    maxlength: 9
  },
  cidade: {
    type: String,
    required: true,
    minlength: 1
  },
  estado: {
    type: String, 
    required: true,
    minlength: 2
  }
});

UserSchema.statics.validarCPF = function (cpf) {
  cpf = cpf.replace(/[^\d]+/g,'');

  if(cpf == '') return false;

  else if(cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999") return false;

  else {
    // Validar primeiro dígito verificador
    var add = 0;
    var restoDiv = 0;
    for(i = 0; i < 9; i++) {
      add += parseInt(cpf.charAt(i)) * (10 - i);
    }
    restoDiv = 11 - (add % 11);
    if(restoDiv == 10 || restoDiv == 11)
      restoDiv = 0;
    else if(restoDiv != parseInt(cpf.charAt(9)))
      return false;

    // Validar segundo dígito verificador
    var add = 0;
    var restoDiv = 0;
    for(i = 0; i < 10; i ++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
    restoDiv = 11 - (add % 11);
    if (restoDiv == 10 || restoDiv == 11)	
      restoDiv = 0;	
	  if (restoDiv != parseInt(cpf.charAt(10)))
		  return false;
    return true;    
  }
}

var User = mongoose.model("User", UserSchema);

module.exports = {User};