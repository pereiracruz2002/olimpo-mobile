pet.factory('EmpresasService', function($http, URL_API){
    var factory = {};

    factory.cadastrarEmpresas = function (dados)
    {

        return $http({
            method: 'POST',
            url: URL_API+'empresas',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }




    factory.getAllEmpresasOf = function (token)
    {
        return $http({
            method: 'POST',
            url: URL_API+'empresas/getAllEmpresasOf',
            data:"token="+token,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.editarEmpresas = function (dados)
    {
        return $http({
            method: 'POST',
            url: URL_API+'empresas/editarEmpresas',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.buscaDadosEmpresas = function (id)
    {
        return $http({
            method: 'GET',
            url: URL_API+'empresas/getEmpresas/'+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.buscaCEP = function(cep){

        var urlcomcep = "http://cep.republicavirtual.com.br/web_cep.php?cep="+cep+"&formato=json";

        return $http({
            method: 'GET',
            url: urlcomcep,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });



    }

    factory.deletarMinhasEmpresas = function (dados)
    {

        return $http({
            method: 'POST',
            url: URL_API+'empresas/excluir/',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    return factory;
});


