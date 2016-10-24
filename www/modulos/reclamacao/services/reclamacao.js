pet.factory('ReclamacaoService', function($http, URL_API){
    var factory = {};

    factory.cadastrarReclamacao = function (dados)
    {

        return $http({
            method: 'POST',
            url: URL_API+'/reclamacoes/nova',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }



    factory.getAllEmpresas = function ()
    {
        return $http({
            method: 'GET',
            url: URL_API+'empresas/getAllEmpresas',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.getAllEmpresasToAutoComplete = function (dados)
    {
        return $http({
            method: 'POST',
            url: URL_API+'empresas/getAllEmpresasSearch',
            data:"search="+dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.editarReclamacao = function (dados)
    {
        return $http({
            method: 'POST',
            url: URL_API+'empresas/editarEmpresas',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.pesquisa = function (dados)
    {
         return $http({
            method: 'POST',
            url: URL_API+'empresas/getAllEmpresasSearch',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }
    
    return factory;
});


