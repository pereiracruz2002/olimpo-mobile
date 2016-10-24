pet.controller('ServicosCtrl', function($scope,ServicosService,$stateParams) {

    $scope.servicos = [];
    var parametro =  $stateParams.id;
    ServicosService.getAllServicosOf(parametro).then(function(dados){
        $scope.servicos = dados.data;

    });

})

pet.controller('ServicosFavoritosCtrl', function($scope,ServicosService,$stateParams,LoginService) {

    $scope.servicos = [];

    var token = LoginService.getToken();

    var parametro =  $stateParams.id;

    var dados = "users_id="+token;

    ServicosService.getAllServicosFavoritos(dados).then(function(retorno){
        $scope.servicos = retorno.data;
    });

});

pet.controller('BuscarServicos', function($scope,ServicosService,$stateParams,LoginService,AnimaisService,$state) {

    $scope.servicos = [];
    $scope.msg = "";
    $scope.tipos = [];
    $scope.categorias = [];
    $scope.myModel = {
        'tipo_busca' : 'gps',
        'animal' : '',
        'distancia': 1
    }

    $scope.loading =false;

    var token = LoginService.getToken();

    var parametro =  $stateParams.id;

    var dados = "users_id="+token;

    $scope.tipo_selecionados ={selecionado:""};

    AnimaisService.buscaAnimaisCategorias().then(function(retorno){
        $scope.tipos = retorno.data;
    });

    $scope.loading_categorias = false;
    $scope.$watch('myModel.animal', function(){
        var tipo = $scope.myModel.animal;
        $scope.loading_categorias = true;
        if(tipo != ""){
            ServicosService.getAllServicosOf(tipo).then(function(retorno){
                $scope.loading_categorias = false;
                $scope.categorias = retorno.data;
            });
        } else {
            $scope.loading_categorias = false;
            $scope.categorias = [];
        }
    });

    $scope.buscarServico = function(){
        $state.go('app.resultado_buscar_servico', {
            'tipo': $scope.myModel.animal,
            'categoria': $scope.myModel.categoria,
            'tipo_busca': $scope.myModel.tipo_busca,
            'cep': $scope.myModel.cep,
            'distancia': $scope.myModel.distancia
        });
    }
})

pet.controller('ResultadoBuscarServicos', function($scope, ServicosService, $stateParams, LoginService, AnimaisService, $ionicPopup) {
    $scope.loading = true;
    if($stateParams.tipo_busca == 'gps'){
        navigator.geolocation.getCurrentPosition(function(position){
            $stateParams.latitude = position.coords.latitude;
            $stateParams.longitude = position.coords.longitude;
            ServicosService.buscarServicos($.param($stateParams)).then(resultBusca);
        },
        function (error){
            $ionicPopup.alert({
                title: 'Erro: '+error.code,
                template:  error.message
            });
        });
    } else {
        ServicosService.buscarServicos($.param($stateParams)).then(resultBusca);
    } 

    function resultBusca(retorno){
        if(retorno.data.status == "sucesso"){
            $scope.servicos = retorno.data.dados;
            if($scope.servicos.length == 0){
                $scope.msg = "Nenhum serviço encontrado";
            }
        }
        $scope.loading =false;
    }
});
