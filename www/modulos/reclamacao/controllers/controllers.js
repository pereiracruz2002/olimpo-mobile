
pet.controller('ReclamacaoCtrl', function($scope,EmpresasService,$stateParams,LoginService,ReclamacaoService,URL_API,$ionicActionSheet,$timeout, $q, $log) {

    $scope.token = LoginService.getToken();

    $scope.empresas_id =[];

    $scope.empresas = [];

    $scope.retornoEmpresas = [];

    $scope.titles = [];

    $scope.countries = [];



    ReclamacaoService.getAllEmpresas().then(function(dados){
        angular.forEach(dados.data, function(value, key){
            $scope.countries.push({name:value.nome_fantasia,id:value.empresas_id}); 
        }); 
    });


    $scope.callbackMethod = function (query, isInitializing) {
        
        if(isInitializing) {
            ReclamacaoService.getAllEmpresasToAutoComplete(query).then(function(dados){
                $scope.countries = [];
                var total = dados.data.length;
                if(total > 0){
                     angular.forEach(dados.data, function(value, key){
                        $scope.countries.push({name:value.nome_fantasia,id:value.empresas_id}); 
                    }); 
                }else{
                    $scope.countries.push({name:query,id:''});
                }
               
            });
            return $scope.countries;
        }
    }

    $scope.clickedMethod = function (callback) {
        var id = callback.item.id;
        console.log(callback.item.id)
        $('#empresas_id').val(id);
    }
    

    


    // ReclamacaoService.getAllEmpresas().then(function(dados){
    //     $scope.empresas = dados.data;
    // });


    

    $scope.cadastrar= function(){

        var dados = $("#cadastroReclamacao").serialize();


        ReclamacaoService.cadastrarReclamacao(dados).then(function(retorno){

            if(retorno.data.status == "sucesso"){

                window.location="#/app/empresas/listagem/";

            }else{

                alert(retorno.data.msg);

            }


        },function errorCallback(response) {

            console.log(response.data);
            angular.forEach(response.data, function(value, key) {
                var valor = JSON.stringify(value);
                var formato = valor.replace(/["\[\]]/gi,'');
                $scope.msg.push(formato);
            });

        });
       

    }

   

})





