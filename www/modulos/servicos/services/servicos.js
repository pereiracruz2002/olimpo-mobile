pet.factory('ServicosService', function($http, URL_API){
    var factory = {};



    factory.getByServices = function (servico)
    {
        return $http({
            method: 'GET',
            url: URL_API+'servicos/'+servico,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }



    factory.getServicosAll = function ()
    {
        return $http({
            method: 'GET',
            url: URL_API+'servicos',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.getAllServicosOf = function (id)
    {
        return $http({
            method: 'GET',
            url: URL_API+'servicos/getAllServicosOf/'+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.getAllServicosFavoritos = function (dados)
    {
        return $http({
            method: 'POST',
            url: URL_API+'empresas/listaFavoritos',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }



    factory.buscarServicos = function (dados)
    {
        return $http({
            method: 'POST',
            url: URL_API+'servicos/busca',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    return factory;
});


