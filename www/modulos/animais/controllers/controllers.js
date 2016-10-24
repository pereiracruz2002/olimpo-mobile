pet.controller('AnimaisCtrl', function($scope,AnimaisService,LoginService,$ionicSideMenuDelegate) {

	$scope.animais = [];
    $scope.dica = true;

	$scope.loading = true;

	var token = LoginService.getToken();
	AnimaisService.getAnimalsUser(token).then(function(dados){
		$scope.animais = dados.data;
		$scope.loading = false;
	});
});

pet.controller('MeusAnimaisCtrl', function($scope,AnimaisService,LoginService) {
	$scope.animais = [];
	$scope.loading = true;
	var token = LoginService.getToken();

	AnimaisService.getAnimalsUser(token).then(function(dados){
		$scope.animais = dados.data;
		$scope.loading = false;
	});

	$scope.excluir = function(animal){
		$scope.loading = true;
		AnimaisService.deleteAnimalUser(animal,token).then(function(retorno){
			if(retorno.data.status == "sucesso"){
				$scope.animais  = retorno.data.animais;
				$scope.loading = false;
			}else{
				$scope.loading = false;
				alert("Não foi possivel excluir, tente novamente mais tarde");
			}
		});
	}
});


pet.controller('MeusAnimaisNovoCtrl', function($scope,AnimaisService,URL_API,LoginService,$cordovaCamera,$cordovaFileTransfer,$ionicPopup, $ionicActionSheet) {
	$scope.token = LoginService.getToken();
	$scope.tipos = [];
	$scope.racas = [];
    $scope.loading_img = false;

    $scope.myModel = {
        'distancia': 1,
        'mesma_raca': 'nao',
        'porte': '',
        'raca': {}
    };
    
    //Selects
	AnimaisService.buscaAnimaisCategorias().then(function(retorno)
    {
        angular.forEach(retorno.data, function(value, key){
		    $scope.tipos.push({'value': value.tipos_id, 'text': value.nome});
        });
	});
    $scope.selecionarGenero = function(){
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Macho', value: 'macho' },
                { text: 'Fêmea', value: 'femea' }
            ],
            destructiveText: '',
            titleText: 'Selecione o Gênero',
            cancelText: 'Cancelar',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index, button) {
                $('#sexo').val(button.value);
                $scope.genero = button.text;
                return true;
            }
        });
    }
    $scope.selecionarTipos = function(){
        var hideSheet = $ionicActionSheet.show({
            buttons: $scope.tipos,
            destructiveText: '',
            titleText: 'Selecione o Tipo',
            cancelText: 'Cancelar',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index, button) {
                $('#tipos_id').val(button.value);
                $scope.tipo = button.text;
                $scope.racas = [];

                AnimaisService.buscaAnimaisRacas(button.value).then(function (retorno) {
                    angular.forEach(retorno.data, function(value, key){
                        $scope.racas.push({value: value.racas_id, text: value.nome, img: value.img});
                    });
                });
                $scope.racaImg = '';

                return true;
            }
        });
    }

    $scope.selecionarRacas = function(){
        var hideSheet = $ionicActionSheet.show({
            buttons: $scope.racas,
            destructiveText: '',
            titleText: 'Selecione a Raça/Espécie',
            cancelText: 'Cancelar',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index, button) {
                $('#raca').val(button.text);
                $scope.raca = button.text;
                $scope.racaImg = button.img;

                return true;
            },
            cssClass: 'ionicActionSheet-height'
        });
    }

    $scope.selecionarPorte = function(){
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                {value: 'pequeno', text: 'Pequeno'},
                {value: 'medio', text: 'Médio'},
                {value: 'grande', text: 'Grande'}
            ],
            destructiveText: '',
            titleText: 'Selecione a Raça/Espécie',
            cancelText: 'Cancelar',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index, button) {
                $('#porte').val(button.value);
                $scope.porte = button.text;

                return true;
            }
        });
    }

	$scope.verificaSelecaoRaca = function() 
    {
		if($('#raca').val()=="OUTROS"){
			$('#mesma_raca option[value="sim"]').attr('selected','selected');
				$('#mesma_raca').children().eq(2).hide();
		}else{
			$('#mesma_raca').children().eq(2).show();
		}
        if($scope.myModel.raca){
            $scope.myModel.racaImg = $('#raca :selected').data('img');
        } else {
            $scope.myModel.racaImg = '';
        }
	}


	$scope.imagem = function(){
		var options = {
			quality: 50, 
            destinationType: Camera.DestinationType.FILE_URI, 
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY, 
            encodingType: Camera.EncodingType.JPEG, 
            correctOrientation: true, 
            allowEdit: true
		}

		$cordovaCamera.getPicture(options).then(
			function(fileURL) {
				var uploadOptions = {
					fileKey: "arquivo",
					fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
					chunkedMode: false,
					mimeType: "image/jpg",
				};
                $scope.loading_img = true;

				$cordovaFileTransfer.upload(URL_API+"upload/foto", fileURL, uploadOptions).then(
					function(result) {
                        $scope.loading_img = false;
						var resultado = result.response.trim();
						$("#imagem").val(resultado);
                        $scope.myModel.imagem = resultado;
					}, function(err) {
						console.log(err);
					});

			});
	}


	$scope.cadastrar = function(){
		var dados = $("#cadastroAnimais").serialize();
		if($("#imagem").val() != ""){
            console.log(dados)
            AnimaisService.cadastrar(dados).then(function(retorno){
                if(retorno.data.status == "sucesso"){
                    location.href = "#/app/meus-animais/";
                }else{
                    $ionicPopup.alert({
                        title: 'Atenção',
                        template: 'Não foi possivel efetuar o cadastro no momento'
                    });
                }
            });
        } else {
            $ionicPopup.alert({
                title: 'Atenção',
                template: 'Selecione uma imagem'
            });

        }
	}

	$scope.resgataEndereco = function(){
		var cep = $("#cep").val();
		LoginService.buscaCEP(cep).then(function(retorno){
			var endereco = retorno.data;
			var logradouro = endereco.tipo_logradouro+" "+endereco.logradouro;
			var bairro = endereco.bairro;
			var cidade = endereco.cidade;
			var estado = endereco.uf;

			$scope.endereco = logradouro;
			$scope.bairro = bairro;
			$scope.cidade = cidade;
			$scope.estado = estado;
		});
	}
});


pet.controller('MeusAnimaisEditarCtrl', function($scope,AnimaisService,LoginService,$cordovaCamera,$cordovaFileTransfer,$stateParams,URL_API, $ionicPopup, $ionicActionSheet) {
	
	$scope.animais_id = $stateParams.id;
	$scope.token = LoginService.getToken();
	$scope.tipos = [];
	$scope.animal = {};
	$scope.animal.tipos_id = 0;
	$scope.racas = [];
	$scope.objracas = {"selecionado":""};
	$scope.api = URL_API;
    $scope.loading_img = false;

    //Selects
	AnimaisService.buscaAnimaisCategorias().then(function(retorno)
    {
        angular.forEach(retorno.data, function(value, key){
		    $scope.tipos.push({'value': value.tipos_id, 'text': value.nome});
        });
	});
    $scope.textGenero = function(genero){
        var generos = {
            'macho': 'Macho',
            'femea': 'Fêmea'
        }
        return generos[genero];
    }

    $scope.textPorte = function(genero){
        var generos = {
            'pequeno': 'Pequeno',
            'medio': 'Médio',
            'grande': 'Grande'
        }
        return generos[genero];
    }

    $scope.selecionarGenero = function(){
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Macho', value: 'macho' },
                { text: 'Fêmea', value: 'femea' }
            ],
            destructiveText: '',
            titleText: 'Selecione o Gênero',
            cancelText: 'Cancelar',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index, button) {
                $('#sexo').val(button.value);
                $scope.animal.sexo = button.value;
                return true;
            }
        });
    }

    $scope.selecionarTipos = function(){
        var hideSheet = $ionicActionSheet.show({
            buttons: $scope.tipos,
            destructiveText: '',
            titleText: 'Selecione o Tipo',
            cancelText: 'Cancelar',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index, button) {
                $('#tipos_id').val(button.value);
                $scope.animal.tipos_id = button.value;
                $scope.animal.tipos.nome = button.text;
                $scope.racas = [];
                $scope.animal.raca = '';
                AnimaisService.buscaAnimaisRacas(button.value).then(function (retorno) {
                    angular.forEach(retorno.data, function(value, key){
                        $scope.racas.push({value: value.racas_id, text: value.nome, img: value.img});
                    });
                });
                $scope.racaImg = '';


                return true;
            }
        });
    }

    $scope.selecionarRacas = function(){
        var hideSheet = $ionicActionSheet.show({
            buttons: $scope.racas,
            destructiveText: '',
            titleText: 'Selecione a Raça/Espécie',
            cancelText: 'Cancelar',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index, button) {
                $('#raca').val(button.text);
                $scope.animal.raca = button.text;
                $scope.racaImg = button.img;

                return true;
            }
        });
    }

    $scope.selecionarPorte = function(){
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                {value: 'pequeno', text: 'Pequeno'},
                {value: 'medio', text: 'Médio'},
                {value: 'grande', text: 'Grande'}
            ],
            destructiveText: '',
            titleText: 'Selecione a Raça/Espécie',
            cancelText: 'Cancelar',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index, button) {
                $('#porte').val(button.value);
                $scope.animal.porte = button.value;

                return true;
            }
        });
    }

	AnimaisService.getAnimal($scope.animais_id).then(function(retorno){
		$scope.animal = retorno.data;
		AnimaisService.buscaAnimaisRacas(retorno.data.tipos_id).then(function (ret) {
			$scope.racas = [];
            angular.forEach(ret.data, function(value, key){
                $scope.racas.push({value: value.racas_id, text: value.nome, img: value.img});
            });

		});

		$scope.objracas.selecionado = retorno.data.raca;
	});

	$scope.verificaSelecaoRaca = function(){
		if($('#raca').val()=="OUTROS"){
			$('#mesma_raca option[value="sim"]').attr('selected','selected');
			$('#mesma_raca').children().eq(2).hide();
		}
	}

	$scope.imagem = function()
    {
		var options =   {
			quality: 50
			, destinationType: Camera.DestinationType.FILE_URI
			, sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			, encodingType: Camera.EncodingType.JPEG
            , correctOrientation: true
            , allowEdit: true
		}

		$cordovaCamera.getPicture(options).then(

			function(fileURL) {


				var uploadOptions = {
					fileKey: "arquivo",
					fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
					chunkedMode: false,
					mimeType: "image/jpg",
				};
                $scope.loading_img = true;


				$cordovaFileTransfer.upload(URL_API+"upload/foto", fileURL, uploadOptions).then(
					function(result) {

						var resultado = result.response.trim();
                        console.log(resultado)
                        $scope.animal.imagem = resultado;

						$("#imagem").val(resultado);
                        $scope.loading_img = false;
						
					}, function(err) {
                        $scope.loading_img = false;
                        $ionicPopup.alert({
                            title: 'Atenção: '+err.status,
                            template: err.statusTxt
                        });

						console.log(err);
					});

			});


	}

	$scope.resgataEndereco = function(){

		var cep = $("#cep").val();

		LoginService.buscaCEP(cep).then(function(retorno){
			var endereco = retorno.data;
			var logradouro = endereco.tipo_logradouro+" "+endereco.logradouro;
			var bairro = endereco.bairro;
			var cidade = endereco.cidade;
			var estado = endereco.uf;

			$scope.endereco = logradouro;
			$scope.bairro = bairro;
			$scope.cidade = cidade;
			$scope.estado = estado;
		});
	}

	$scope.verificaSelecaoRaca = function(){
		if($('#raca').val()=="OUTROS"){
			$('#mesma_raca option[value="sim"]').attr('selected','selected');
			$('#mesma_raca').children().eq(2).hide();
		}else{
			$('#mesma_raca').children().eq(2).show();
		}

	}
	
	$scope.editar = function(){
		var dados = $("#editarAnimais").serialize();
		AnimaisService.editar(dados).then(function(retorno){
			if(retorno.data.status == "sucesso"){
				location.href = "#/app/meus-animais/";
			}else{
				alert("Não foi possivel editar o cadastro no momento");
			}

		});
	}
});


pet.controller('encontrosCtrl', function($scope,$stateParams,AnimaisService,LoginService) {

	$scope.animais = [];

	$scope.animais_id = $stateParams.id;



	var token = LoginService.getToken();

	var inicia = 0;

	var contador = 0;

	var quantidade = 50; 

	var listaDeRejeitados = {"rejeitados":[]};


	AnimaisService.getMeeting($scope.animais_id,inicia,quantidade,listaDeRejeitados).then(function(retorno){

		$scope.animais = retorno.data;

		$scope.animal = $scope.animais[contador];


		quantidade = $scope.animais.length;

		
		//console.log($scope.animal);

	});

	$scope.descartar = function(id_animal){



		var animal1 = $scope.animais_id;
		var animal2 = id_animal;
		listaDeRejeitados.rejeitados.push(id_animal);

		//console.log(listaDeRejeitados);

		quantidade = $scope.animais.length;

		delete($scope.animais[contador]);
		contador++;

		if(contador == quantidade){
			$scope.animais = [];

			AnimaisService.getMeeting($scope.animais_id,inicia,quantidade,listaDeRejeitados).then(function(retorno){

				$scope.animais = retorno.data;

				if($scope.animais.length > "0"){
					contador = 0;
					$scope.animal = $scope.animais[contador];

				}

			});



		}else{

			$scope.animal = $scope.animais[contador];
		}

	}


	$scope.par = function(animal){

		var animal1 = $scope.animais_id;

		var animal2 = animal;


		

		AnimaisService.makeMatching(animal1,animal2).then(function(retorno){});
		

		delete($scope.animais[contador]);
	
		contador++;

		if(contador == quantidade){
			$scope.animais = [];


			
			AnimaisService.getMeeting($scope.animais_id,inicia,quantidade,listaDeRejeitados).then(function(retorno){

				$scope.animais = retorno.data;



				if($scope.animais.length > "0"){
					contador = 0;
					$scope.animal = $scope.animais[contador];
					
				}else{
					$scope.animal = [];
				}

			});
		


		}else{

			$scope.animal = $scope.animais[contador];
		}
		
		var dadosForm = "meu="+animal1+"&combinacao="+animal+"&tipo=combinação";
		LoginService.notificacaoCombinacao(dadosForm).then(function(retorno){

			console.log(retorno.data);

		});


	}


	
});


pet.controller('encontrosMatchesCtrl', function($scope,$stateParams,AnimaisService,LoginService) {
	$scope.loading = true;
	$scope.animais_id = $stateParams.id;
	$scope.animais = [];
	
	AnimaisService.getListCombination($scope.animais_id).then(function(retorno){
		$scope.animais = retorno.data;
		$scope.loading = false;

	});
});




pet.controller('encontrosDetalhesMatchesCtrl', function($scope,$stateParams,$filter, $timeout,AnimaisService,LoginService,URL_SOCKET,URL_API,$location,LoginService,$rootScope) {
	var socket = io.connect(URL_SOCKET);
	var inicio = 4;
	var quantidade = 10; 
	$scope.loading = true;
	$scope.conversas= {"conversas":[]};
	var token = LoginService.getToken();
	url = $location.path();
	LoginService.alteraStatusNotificacaoPorUrl(url,token).then(function(retorno){
		$rootScope.qtdNotification = retorno.data.quantidade;
	});

	$("#mostra-menu").on("click",function(){
		$(".opcoes").slideToggle("slow");
	});

	
	$('#opt-denuncia').hide();
	$('#denuncias textarea').hide();
	$scope.sala = '';
	$scope.animais_id = $stateParams.id;
	$scope.meuAnimal = $stateParams.meuAnimal;

	$scope.salas = [];

	var token = LoginService.getToken();
	var meu_animal = $scope.meuAnimal;

	$scope.$on('$viewContentLoaded', function() {
	    //call it here
	});





	AnimaisService.getSalaAnimal($scope.animais_id,$scope.meuAnimal).then(function(retorno){

		$scope.sala = retorno.data[0].salas_combinacoes_id;

		var dados= "sala="+$scope.sala;
		AnimaisService.conversas(dados).then(function(retorno){

			//$scope.conversas= retorno.data;

			$scope.conversas.quantidade = retorno.data.quantidade;
			for (item in retorno.data.conversas) {
				$scope.conversas.conversas.unshift(retorno.data.conversas[item]);
			};


			$("#conversas").css({
				'padding-bottom': '40px'
			});


			$scope.loading = false;

		});
	});

	$scope.anteriores = function(){
		AnimaisService.getSalaAnimal($scope.animais_id,$scope.meuAnimal).then(function(retorno){
			$scope.loading = true;
			$scope.sala = retorno.data[0].salas_combinacoes_id;
			var dados= "sala="+$scope.sala+"&inicio="+inicio+"&quantidade="+quantidade;
			AnimaisService.conversas(dados).then(function(retorno){
                if(retorno.data.conversas.length > 0){
                    for (item in retorno.data.conversas) {
                        $scope.conversas.conversas.unshift(retorno.data.conversas[item]);
                    };

                    inicio = inicio +10;

                    $("#conversas").css({
                        'padding-bottom': '40px'
                    });
                }else{
                    $("#mostra-mais").hide();
                }

                $scope.loading = false;
			});

		});

	}
	$scope.mostrarOpcaoDenuncia = function(){
		$('#opt-denuncia').show();
		$(".opcoes").slideToggle("slow");
	}

	AnimaisService.getAnimal($scope.meuAnimal).then(function(retorno){
		socket.emit('entrou', { "sala":  $scope.sala,"animal":retorno.data});
	});

	$scope.$on('$ionicView.leave', function(){
	  socket.emit('sair', { "sala": $scope.sala});
	});

	$scope.showTextarea = function(){
		$('#denuncias textarea').show();
	}

	$scope.hideTextarea = function(){
		$('#denuncias textarea').hide();
	}

	$scope.denunciar = function(id_animal){
		$scope.loadingdenuncia = true;
		var dados = $( "input:radio:checked" ).val();
		if(dados=="Outros"){
			dados = $( "#texto" ).val();
		}
		AnimaisService.denunciar($scope.animais_id,token,dados).then(function(retorno){
			if(retorno.data.status == "sucesso"){
				alert("Sua denúncia foi registrada com sucesso");
				location.href="#/app/encontros/matches/"+meu_animal;
				$scope.loadingdenuncia = false;
			}else{
				alert("Desculpe sua denúncia não foi resgistrada no momento tente novamente mais tarde");
				$scope.loadingdenuncia = false;
			}
		});
	}

	$scope.descombinar = function()
    {
		var animal_id = $scope.animais_id;
		var meu_animal = $scope.meuAnimal;
		AnimaisService.descombinar(animal_id,meu_animal).then(function(retorno){
			if(retorno.data.status == "sucesso"){
				location.href="#/app/encontros/matches/"+meu_animal;
			}
		});
	}

	$scope.enviarMensagem = function()
    {
		var mensagem = $('#enviaconversas #mensagem').val();
		var sala = $('#enviaconversas #sala').val();
		var animais_id = $('#enviaconversas #animais_id').val();
		socket.emit('envia-mensagem', { "sala":sala, "mensagem":mensagem ,"animais_id":animais_id});
		$('#mensagem').val('');


		$('#conversas').animate({scrollTop: document.getElementById('conversas').scrollHeight}, 'slow');

		console.log(token);


		var dados = "meu="+animais_id+"&sala="+sala+"&tipo=conversa_combinações&animal="+$scope.animais_id+"&logado="+token;


		LoginService.cadastraNotificacoes(dados).then(function(retorno){
			//console.log(retorno.data[1]);
		});

	}

	socket.on("adicionaMensagem",function(data){
		AnimaisService.getAnimal(data.animais_id).then(function(retorno){

			var datadamensagem =  $filter('formata_datetime')(data.hora);

			var html = "<a class='item item-avatar'>";
			html+="<img src='"+URL_API+"uploads/"+retorno.data.imagem+"'>";
			html+="<h2>"+retorno.data.nome+" <strong>"+datadamensagem+"</strong></h2>";
			html+="<p>"+data.mensagem+"</p>";
			html+="</a>";

			$('#conversas').append(html);

			$("#nenhumamensagem").hide();

		});
	});
});

