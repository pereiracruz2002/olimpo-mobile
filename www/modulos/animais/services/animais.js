pet.factory('AnimaisService', function($http, URL_API){
    var factory = {};


    factory.getAnimalsUser = function (id) 
    {
        return $http({
            method: 'GET',
            url: URL_API+'user/getAllAnimalsOfUser/'+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.getAnimal = function(animal)
    {
        return $http({
            method: 'GET',
            url: URL_API+'animais/getAnimal/'+animal,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.deleteAnimalUser = function(id,token)
    {
        return $http({
            method: 'GET',
            url: URL_API+'user/deleteAnimalUser/'+id+'/'+token,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

    }


    factory.buscaAnimaisCategorias = function()
    {
        return $http({
            method: 'GET',
            url: URL_API+'animais/categorias',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.buscaAnimaisRacas = function(id)
    {
        return $http({
            method: 'GET',
            url: URL_API+'raca/retornaRaca/'+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.cadastrar = function(dados)
    {
        return $http({
            method:"POST",
            url: URL_API+'animais/cadastrar',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }

    factory.editar = function(dados)
    {
        return $http({
            method:"POST",
            url: URL_API+'animais/editar',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }

    factory.getMeeting = function(animal,inicia,quantidade,rejeitados)
    {
        return $http({
            method: 'POST',
            url: URL_API+'animais/getParesAnimal',
            data:"animal="+animal+"&inicia="+inicia+"&quantidade="+quantidade+"&rejeitados="+JSON.stringify(rejeitados),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    factory.makeMatching = function(animal1,animal2)
    {
        return $http({
            method: 'POST',
            url: URL_API+'animais/salvaCombinacao',
            data:"animal1="+animal1+"&animal2="+animal2,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

    }

    factory.getListCombination = function(animal)
    {
        return $http({
            method: 'GET',
            url: URL_API+'animais/getCombinados/'+animal,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

    }



    factory.denunciar = function(animais_id, token, dados) {

        return $http({
            method: "POST",
            url: URL_API + 'animais/denunciar',
            data: "animais_id=" + animais_id + "&denuciante=" + token + "&denuncia=" + dados,

            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    factory.descombinar = function(animal,meuAnimal){

        return $http({
            method: 'POST',
            url: URL_API+'animais/descombinar',
            data:"meuAnimal="+meuAnimal+"&animal="+animal,

            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

    }


    factory.getSalaAnimal = function(animal,meuAnimal){

        return $http({
            method: 'POST',
            url: URL_API+'animais/getSalasAnimais',
            data:"animal1="+meuAnimal+"&animal2="+animal,

            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

    }



    factory.conversas = function(dados){

        return $http({
            method: 'POST',
            url: URL_API+'animais/conversas',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

    }


    factory.conversasanteriores = function(dados){

        return $http({
            method: 'POST',
            url: URL_API+'animais/conversasanteriores',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

    }


    return factory;
});
