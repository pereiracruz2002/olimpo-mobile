pet.controller('EmpresasCtrl', function($scope,EmpresasService,$stateParams,LoginService,$cordovaCamera,$cordovaFileTransfer,URL_API) {

    $scope.token = LoginService.getToken();

    $scope.empresa = {};


    $scope.imagem = function(){



        var options =   {
            quality: 100
            , destinationType: Camera.DestinationType.FILE_URI
            , sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            , encodingType: Camera.EncodingType.JPEG
        }

        $cordovaCamera.getPicture(options).then(

            function(fileURL) {


                var uploadOptions = {
                    fileKey: "arquivo",
                    fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
                    chunkedMode: false,
                    mimeType: "image/jpg",
                };


                $cordovaFileTransfer.upload(URL_API+"upload/foto", fileURL, uploadOptions).then(
                    function(result) {

                        var resultado = result.response.trim();


                        $("#imagem").val(resultado);

                    }, function(err) {
                        console.log(err);
                    });

            });


    }

    $scope.cadastrar= function(){

        var dados = $("#cadastroEmpresas").serialize();

        if($("#imagem").val() != ""){


            EmpresasService.cadastrarEmpresas(dados).then(function(retorno){

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
        }else{
            alert("selecione uma imagem");
        }

    }

    $scope.resgataEndereco = function(){

        var cep = $("#cep").val();



        EmpresasService.buscaCEP(cep).then(function(retorno){

            var endereco = retorno.data;

            var logradouro = endereco.tipo_logradouro+" "+endereco.logradouro;

            var bairro = endereco.bairro;

            var cidade = endereco.cidade;

            var estado = endereco.uf;


            $scope.empresa.endereco = logradouro;

            $scope.empresa.bairro = bairro;

            $scope.empresa.cidade = cidade;

            $scope.empresa.estado = estado;





        });

    }


})


pet.controller('EmpresasListagemCtrl', function($scope,EmpresasService,$stateParams,LoginService) {

    $scope.empresas = [];
    $scope.token = LoginService.getToken();

    EmpresasService.getAllEmpresasOf($scope.token).then(function(dados){
        $scope.empresas = dados.data;

    });

    $scope.excluir=function(empresa_id){

        var dados = "empresas_id="+empresa_id+"&token="+$scope.token;


        EmpresasService.deletarMinhasEmpresas(dados).then(function(retorno){

            $scope.servicos=retorno.data;

            $scope.loading = false;


        });

    }

})


pet.controller('EmpresasEditarCtrl', function($scope,EmpresasService,$stateParams,LoginService,$cordovaCamera,$cordovaFileTransfer,URL_API) {

    $scope.minhaEmpresa = '';

    $scope.empresa = {};

    $scope.token = LoginService.getToken();

    $scope.empresa_id = $stateParams.empresa_id;

    $scope.api = URL_API;

    EmpresasService.buscaDadosEmpresas($scope.empresa_id).then(function(dados){
        //$scope.empresas = dados.data;
        $scope.empresa = dados.data[0];

        //console.log( $scope.empresa.enderecos.telefone);
    });


    $scope.imagem = function(){

        var options =   {
            quality: 100
            , destinationType: Camera.DestinationType.FILE_URI
            , sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            , encodingType: Camera.EncodingType.JPEG
        }

        $cordovaCamera.getPicture(options).then(

            function(fileURL) {


                var uploadOptions = {
                    fileKey: "arquivo",
                    fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
                    chunkedMode: false,
                    mimeType: "image/jpg",
                };


                $cordovaFileTransfer.upload(URL_API+"upload/foto", fileURL, uploadOptions).then(
                    function(result) {

                        var resultado = result.response.trim();

                        $("#imagem").val(resultado);

                    }, function(err) {
                        console.log(err);
                    });

            });


    }

    $scope.editar= function(){

        var dados = $("#cadastroEmpresas").serialize();

        if($("#imagem").val() != "") {
            EmpresasService.editarEmpresas(dados).then(function (retorno) {

                if (retorno.data.status == "sucesso") {
                    window.location = "#/app/empresas/listagem";

                } else {

                    alert(retorno.data.msg);

                }


            }, function errorCallback(response) {

                console.log(response.data);
                angular.forEach(response.data, function (value, key) {
                    var valor = JSON.stringify(value);
                    var formato = valor.replace(/["\[\]]/gi, '');
                    $scope.msg.push(formato);
                });

            });
        }else{
            alert("selecione uma imagem");
        }

    }

    $scope.resgataEndereco = function(){

        var cep = $("#cep").val();



        EmpresasService.buscaCEP(cep).then(function(retorno){

            var endereco = retorno.data;

            var logradouro = endereco.tipo_logradouro+" "+endereco.logradouro;

            var bairro = endereco.bairro;

            var cidade = endereco.cidade;

            var estado = endereco.uf;


            $scope.empresa.enderecos.endereco = logradouro;

            $scope.empresa.bairro = bairro;

            $scope.empresa.cidade = cidade;

            $scope.empresa.estado = estado;

        });

    }


})



