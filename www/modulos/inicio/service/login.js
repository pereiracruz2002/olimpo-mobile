pet.factory('LoginService', function($http, URL_API){
    var factory = {};


    factory.loginSimple = function (dados) 
    {
        return $http({
            method: 'POST',
            url: URL_API+'login/simple',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.fbLogin = function (accessToken) 
    {
        return $http({
            method: 'POST',
            url: URL_API+'login/fbLogin',
            data:'accessToken='+accessToken,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.updatePosition= function (coords) 
    {
        var dados = 'latitude='+coords.latitude+'&longitude='+coords.longitude+'&token='+localStorage.getItem("pet-token");
        return $http({
            method: 'POST',
            url: URL_API+'login/updatePosition',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.setToken = function(token){

        localStorage.setItem("pet-token", token);

    }

    factory.getToken = function(){
        
        return localStorage.getItem("pet-token");
    }


    factory.logout = function(){
        localStorage.removeItem("pet-token");
    }

    factory.buscaCEP = function(cep){

        var urlcomcep = "http://cep.republicavirtual.com.br/web_cep.php?cep="+cep+"&formato=json";

        return $http({
            method: 'GET',
            url: urlcomcep,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });


        
    }

    factory.AtualizaDadosUsuario = function (dados) 
    {
        
        return $http({
            method: 'POST',
            url: URL_API+'push/AtualizaDadosUsuario',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.listaNotificacoes = function (token,inicio,quantidade) 
    {
        
        return $http({
            method: 'POST',
            url: URL_API+'notificacoes/listagem',
            data:"token="+token+"&inicio="+inicio+"&quantidade="+quantidade,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.alteraStatusNotificacao = function (id,token) 
    {
        
        return $http({
            method: 'POST',
            url: URL_API+'notificacoes/alteraStatus',
            data:"id="+id+"&token="+token,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.alteraStatusNotificacaoPorUrl = function (url,token) 
    {
        
        return $http({
            method: 'POST',
            url: URL_API+'notificacoes/alteraStatusUrl',
            data:"url="+url+"&token="+token,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.notificacaoCombinacao = function (dados)
    {

        return $http({
            method: 'POST',
            url: URL_API+'notificacoes/notificacaoCombinacao',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.cadastraNotificacoes = function (dados)
    {

        return $http({
            method: 'POST',
            url: URL_API+'notificacoes/conversas',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.updatePerfil = function (dados)
    {

        return $http({
            method: 'POST',
            url: URL_API+'user/updatePerfil',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }







    return factory;
});
