pet.factory('DicasService', function($http, URL_API){
    var factory = {};
    factory.getDicaDoDia = function (dados)
    {

        return $http({
            method: 'GET',
            url: URL_API+'dicas/doDia',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }
    return factory;
})
