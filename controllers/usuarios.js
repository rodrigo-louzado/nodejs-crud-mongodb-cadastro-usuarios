const {User} = require('../models/Usuario');

/**
 * GET /
 * Lista de usuários page.
 */
exports.listaUsuarios = (req, res) => {
  User.find({}, (err, usuarios) => {
    if(err)
      res.status(400).send(err);
    res.render('usuarios', {usuarios});
  });
};

/**
 * GET /
 * GET edit user page
 */
exports.editarPage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
   
    if(!user) {
      return res.status(404).send()
    }

    res.render('editUser', {
      formType: 'Editar',
      user
    });
  } catch (e) {
    res.status(500).send(e);
  }  
};

/**
 * POST /
 * Editar user data
 */
exports.editarUser = async (req, res) => {
  const usuario = {
    _id: req.params.id,
    nome: req.body.nome,
    telefone: req.body.telefone,
    nascimento: req.body.nascimento,
    rg: req.body.rg,
    cpf: req.body.cpf,
    endereco: req.body.endereco,
    cep: req.body.cep,
    cidade: req.body.cidade,
    estado: req.body.estado
  };
  
  if(User.validarCPF(usuario.cpf) === true) {
    await User.findByIdAndUpdate(req.params.id, usuario, (err, user) => {
      if(err)
        return res.send(err);
      res.redirect('/');
    }); 
  } else {
    var user = await User.findById(req.params.id);
    res.render('editUser', {
      user, 
      formType: 'Editar', 
      messages:{errors: {msg: 'Erro ao editar usuário! CPF inválido'}}
    });
  }
};

/**
 * POST /
 * Criar novo usuário
 */
exports.postUsuario = async (req, res) => {
  const user = new User({
    nome: req.body.nome,
    telefone: req.body.telefone,
    nascimento: req.body.nascimento,
    rg: req.body.rg,
    cpf: req.body.cpf,
    endereco: req.body.endereco,
    cep: req.body.cep,
    cidade: req.body.cidade,
    estado: req.body.estado
  });

  if(User.validarCPF(user.cpf)  === true) {
    await user.save().then((doc) => {
      res.render('cadastrar', {messages:{success: {msg: 'Usuário adicionado com sucesso'}}});
    }, (e) => {
      res.render('cadastrar', {formType: 'Cadastrar', messages:{errors: {msg: 'Erro ao cadastrar usuário', e}}});
    });
  } else {
    res.render('editUser', {user, formType: 'Cadastrar', messages:{errors: {msg: 'Erro ao cadastrar usuário! CPF inválido'}}});
  }
};

/**
 * GET /
 * Cadastro page.
 */
exports.cadastrar = (req, res) => {
  res.render('cadastrar', {
    formType: 'Cadastrar'
  });
};

/**
 * DELETE /
 * Deletar usuário por ID
 */
exports.deletarUsuario = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
   
    if(!user) {
      return res.status(404).send()
    }
    User.find({}, (err, usuarios) => {
      if(err)
        res.status(400).send(err);
      res.render('usuarios', {usuarios, messages:{success: {msg: 'Usuário deletado com sucesso'}}});
    });
    
  } catch (e) {
    res.status(500).send(e);
  }  
};
