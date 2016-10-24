pet.controller('ListagemDoacoesCtrl', function($scope,DoacaoService,LoginService,$cordovaCamera,$cordovaFileTransfer) {


	$scope.token = LoginService.getToken();

	 $scope.loading = true;

	$scope.minhasDoacoes = [];




	DoacaoService.listagem($scope.token).then(function(retorno){

		$scope.minhasDoacoes = retorno.data;

		 $scope.loading = false;

	});

	$scope.excluir = function(id){

		 $scope.loading = true;

		DoacaoService.excluir(id).then(function(retorno){

			$scope.minhasDoacoes = retorno.data;

			$scope.loading = false;
			
		});

	}

	$scope.alterarStatus = function(id){

		$scope.loading = true;

		var tipo = $("#tipo").is(':checked');



		var isativo = "Inativo";

		if(tipo == true){
			isativo = "Ativo";
		}else{
			isativo = "Inativo";
		}

		DoacaoService.alteraStatus(id,isativo).then(function(retorno){

			 $scope.loading = false;

		});


	}




});



pet.controller('NovaDoacoesCtrl', function(URL_API,$scope,DoacaoService,LoginService,$cordovaCamera,$cordovaFileTransfer) {

	$scope.token = LoginService.getToken();

	$scope.tipos = [];

	$scope.categorias = [];

	$scope.msg = [];

	DoacaoService.buscaTipos().then(function(retorno){

		$scope.tipos = retorno.data;

	});

	DoacaoService.buscaDoacaoCategorias().then(function(retorno){

		$scope.categorias = retorno.data;

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



	$scope.cadastrar = function(){

		var dados = $("#cadastroDoacoes").serialize();

		if($("#imagem").val() != ""){

			DoacaoService.cadastrar(dados).then(function(retorno){

			

			if(retorno.data.status == "sucesso"){

				location.href = "#/app/doacoes";

			}else{
				alert("Não foi possivel efetuar o cadastro no momento");
			}


		},function errorCallback(response) {

			console.log(response);
			angular.forEach(response.data, function(value, key) {
				var valor = JSON.stringify(value);
				var formato = valor.replace(/["\[\]]/gi,'');
				$scope.msg.push(formato);
				console.log($scope.msg);
			});

		});


			}else{
				alert("selecione uma imagem");
			}


	}
	




});



pet.controller('DoacoesEditarCtrl', function(URL_API,$scope,$stateParams,DoacaoService,LoginService,$cordovaCamera,$cordovaFileTransfer) {

	console.log("teste");

	$scope.token = LoginService.getToken();

	$scope.doacoes_id = $stateParams.id; 

	$scope.doacao = "";

	$scope.tipos = [];

	$scope.categorias = [];


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



	

	DoacaoService.buscaTipos().then(function(retorno){

		$scope.tipos = retorno.data;

		console.log($scope.tipos);

		DoacaoService.buscaDoacaoCategorias().then(function(retorno){

			$scope.categorias = retorno.data;

			
			DoacaoService.buscaPorID($scope.doacoes_id).then(function(retorno){

				$scope.doacao = retorno.data;
			
			});


		});

	});


	$scope.editar = function(){

		var dados = $("#editarAnimais").serialize();



		DoacaoService.editar(dados,$scope.doacoes_id).then(function(retorno){

			console.log(retorno.data);

			if(retorno.data.status == "sucesso"){
				location.href = "#/app/doacoes";
			}
		
		});


	}



});


pet.controller('DoacoesDisponiveisCtrl', function($scope,DoacaoService,UsuariosService,LoginService,$cordovaCamera,$cordovaFileTransfer) {

	$scope.token = LoginService.getToken();

	$scope.minhasDoacoes = [];

	$scope.tipos = [];

	$scope.categorias = [];

	$scope.user = "";
    $scope.myModel = {
        'distancia': 1
    }

	 $scope.loading = true;

	 var user = "";

	UsuariosService.buscaUsuario($scope.token).then(function(retorno){

		$scope.loading = true;

		user = retorno.data;

		$scope.user = retorno.data;

		console.log(user);

		var dados = "latitude="+user[0].latitude+"&longitude="+user[0].longitude+"&users_id="+user[0].users_id;

		DoacaoService.listagemDisponiveis(dados).then(function(retorno){

			$scope.minhasDoacoes = retorno.data;

			 $scope.loading = false;

		});

	});

	DoacaoService.buscaDoacaoCategorias().then(function(retorno){

		$scope.categorias = retorno.data;

	});

	DoacaoService.buscaTipos().then(function(retorno){

		$scope.tipos = retorno.data;

	});


	$scope.filtrar = function(){

		 $scope.loading = true;
		var dados = "latitude="+$scope.user[0].latitude+"&longitude="+$scope.user[0].longitude+"&users_id="+$scope.user[0].users_id;

		var form = $("#filtrar").serialize();

		var dadostotal = dados+"&"+form;

		DoacaoService.listagemDisponiveis(dadostotal).then(function(retorno){

			$scope.minhasDoacoes = retorno.data;
			 $scope.loading = false;

		});

	}

	
	
});


pet.controller('DoacoesDetalhesCtrl', function($scope,$stateParams,DoacaoService,UsuariosService,LoginService,$cordovaCamera,$cordovaFileTransfer) {

	$scope.doacoes_id = $stateParams.id; 

	$scope.token = LoginService.getToken();

	$scope.doacao = "";

	$scope.user = "";

	UsuariosService.buscaUsuario($scope.token).then(function(retorno){
		$scope.user = retorno.data;
	});

	DoacaoService.buscaPorID($scope.doacoes_id).then(function(retorno){
		$scope.doacao = retorno.data;
	});


	$scope.criarSala = function(doacao_id,dono){


		var dados = "doacao_id="+doacao_id+"&dono="+dono+"&token="+$scope.token;

		
		DoacaoService.criarSala(dados).then(function(retorno){

	

			if(retorno.data.status == "sucesso"){
				
				console.log(retorno.data.logado);
				console.log(retorno.data.sala);
				location.href="#/app/conversas/detalhes/"+retorno.data.logado+"/"+retorno.data.sala+"/"+2+"";


			}

		});




	}
	
	
});


pet.controller('DoacoesInteressadossCtrl', function($scope,$stateParams,DoacaoService,UsuariosService,LoginService) {

	$scope.doacoes_id = $stateParams.id;

	 $scope.loading = true;

	$scope.interessados = "";

	DoacaoService.buscaInteressadosDoacao($scope.doacoes_id).then(function(retorno){
		console.log(retorno.data)
		$scope.interessados = retorno.data;
		 $scope.loading = false;
	});


});










