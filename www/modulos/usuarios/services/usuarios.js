pet.factory('UsuariosService', function($http, URL_API){
    var factory = {};


    factory.buscaUsuario = function (token)
    {
       return $http({
           method: 'POST',
           url: URL_API+'usuario/busca',
           data:"token="+token,
           headers: {'Content-Type': 'application/x-www-form-urlencoded'}
       });
    }


    factory.editar = function (dados)
    {
       return $http({
           method: 'POST',
           url: URL_API+'user/editar',
           data:dados,
           headers: {'Content-Type': 'application/x-www-form-urlencoded'}
       });
    }

    factory.getByServico = function (servico_id, coords)
    {
        var dados = 'latitude='+coords.latitude+'&longitude='+coords.longitude;
        return $http({
            method: 'POST',
            url: URL_API+'users/hasServico/'+servico_id,
            data: dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }



    factory.preCadastro = function (dados)
    {
        return $http({
            method: 'POST',
            url: URL_API+'user/preCadastro',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.lembrete = function (email)
    {
        return $http({
            method: 'POST',
            url: URL_API+'user/recuperarSenha',
            data: 'email='+email,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.detalhe = function (users_id)
    {

        return $http({
            method: 'GET',
            url: URL_API+'users/find/'+users_id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.detalheServico = function (servico,token)
    {

        return $http({
            method: 'GET',
            url: URL_API+'servicos/busca/'+servico+"/"+token,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.curtir = function (servico,token,valor)
    {

        return $http({
            method: 'POST',
            url: URL_API+'servicos/avaliacao',
            data:'user_servicos_id='+servico+"&users_id="+token+"&valor="+valor,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.listagemMeusServicos = function (empresas_id)
    {

        return $http({
            method: 'POST',
            url: URL_API+'servicos/meusservicos',
            data:"empresas_id="+empresas_id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.cadastrarMeusServicos = function (dados)
    {

        return $http({
            method: 'POST',
            url: URL_API+'usersServicos',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.deletarMeusServicos = function (dados)
    {

        return $http({
            method: 'POST',
            url: URL_API+'servicos/meusservicos/excluir',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.editarMeusServicos = function (dados)
    {

        return $http({
            method: 'POST',
            url: URL_API+'usersServicos/editar',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.listagemComentariosPrestador = function(servico){
        return $http({
            method: 'POST',
            url: URL_API+'servicos/comentariosPrestador',
            data:"servico="+servico,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.cadastraComentarioPrestador = function(dados){
        return $http({
            method: 'POST',
            url: URL_API+'servicos/cadastraComentariosPrestador',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.cadastraRespostaPrestador = function(dados){
        return $http({
            method: 'POST',
            url: URL_API+'servicos/cadastraRespostaPrestador',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.getMensagens = function (id, token)
    {
        return $http({
            method: 'POST',
            url: URL_API+'salas/'+id,
            data: 'token='+token,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.getConvesas = function (dados)
    {
        return $http({
            method: 'POST',
            url: URL_API+'conversas',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.cadastrarMensagem = function (dados)
    {
        return $http({
            method: 'POST',
            url: URL_API+'sala/novaMensagem',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.iniciarConversa = function (dados)
    {
        return $http({
            method: 'POST',
            url: URL_API+'sala/novaConversa',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.favoritar = function (dados)
    {
        return $http({
            method: 'POST',
            url: URL_API+'servico/alteraFavorito',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }



    return factory;
});


