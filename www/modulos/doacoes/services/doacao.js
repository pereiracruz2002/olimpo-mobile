pet.factory('DoacaoService', function($http, URL_API){
    var factory = {};


    factory.buscaPorID = function(id){
        return $http({
            method:"GET",
            url: URL_API+'doacoes/'+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }



    factory.listagem = function(id){
        return $http({
            method:"POST",
            url: URL_API+'doacoes/getminhasdoacoes',
            data:"users_id="+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }



    factory.listagemDisponiveis = function(dados){
        return $http({
            method:"POST",
            url: URL_API+'listaItensDisponiveis',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }


    factory.cadastrar = function(dados){
        return $http({
            method:"POST",
            url: URL_API+'doacoes',
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }



    factory.excluir = function(id){
        return $http({
            method:"DELETE",
            url: URL_API+'doacoes/'+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }


    factory.buscaDoacaoCategorias = function(){


        return $http({
            method: 'GET',
            url: URL_API+'doacoes/categorias/listagem',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });


    }


    factory.buscaTipos = function(){

        return $http({
            method: 'GET',
            url: URL_API+'/animais/categorias',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });


    }


    factory.editar = function(dados,id){
        return $http({
            method:"POST",
            url: URL_API+'doacoes/'+id,
            data:dados,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
    }



    factory.alteraStatus = function(id,status){

        return $http({
            method: 'POST',
            url: URL_API+'/doacoes/alterar/status',
            data:"id="+id+"&status="+status,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });


    }



    factory.buscaInteressadosDoacao = function(id){

        return $http({
            method: 'POST',
            url: URL_API+'listaInteressandosDoacao',
            data:"id="+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}

        });


    }

    factory.criarSala = function(dados){

        return $http({
            method: 'POST',
            url: URL_API+'doacoes/criarSala',
            data:dados,

            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });


    }




    return factory;
});
