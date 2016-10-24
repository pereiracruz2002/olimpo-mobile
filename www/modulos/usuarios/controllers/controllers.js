pet.controller('UsuariosServicoCtrl', function($scope, UsuariosService, $stateParams) {

    $scope.empresas = [];
    $scope.loading = true;
	var resultado = '';
	$scope.msg = 'Carregando...';


    navigator.geolocation.getCurrentPosition(function(position){
			$scope.msg="Carregando";
        UsuariosService.getByServico($stateParams.servico_id, position.coords).then(function(dados){
            $scope.empresas = dados.data;
			$scope.loading = false;
			if(dados.data.length==0){
				$scope.msg="Nenhum Serviço Encontrado";
			}else{
				$scope.msg = " ";
			}


        });
    },
    function (error){
        alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
		$scope.loading = false;
    }, {
        enableHighAccuracy: false
        ,timeout : 20000
    });



})

pet.controller('CadastroServicoCtrl', function($scope, UsuariosService, $state, $ionicPopup) {
    $scope.mainForm = {};

   
   $scope.cadastrar= function(){

   		var dados = $("#form-cadastro").serialize();
	    $scope.msg=[];

   		UsuariosService.preCadastro(dados).then(function(retorno){

   			if(retorno.data.status == "sucesso"){
                $ionicPopup.alert({
                    title: 'Parabéns!',
                    template: retorno.data.msg
                });
   				$state.go("login");
   			} else {
                $ionicPopup.alert({
                    title: 'Atenção:',
                    template: retorno.data.msg
                });
   			}

   		},function errorCallback(response) {
			angular.forEach(response.data, function(value, key) {
				var valor = JSON.stringify(value);
				var formato = valor.replace(/["\[\]]/gi,'');
				$scope.msg.push(formato);
			});

		});


   }

})

function validarCpf(cpf) {
    if (cpf.length < 11) return false

    var nonNumbers = /\D/

    if (nonNumbers.test(cpf))return false

    if (cpf == "00000000000" || cpf == "11111111111" ||

        cpf == "22222222222" || cpf == "33333333333" ||

        cpf == "44444444444" || cpf == "55555555555" ||

        cpf == "66666666666" || cpf == "77777777777" ||

        cpf == "88888888888" || cpf == "99999999999")

            return false

    var a = []

    var b = new Number

    var c = 11

    for (i=0; i<11; i++){

      a[i] = cpf.charAt(i)

      if (i < 9) b += (a[i] * --c)

    }

    if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11-x }

    b = 0

    c = 11

    for (y=0; y<10; y++) b += (a[y] * c--)

    if ((x = b % 11) < 2) { a[10] = 0 } else { a[10] = 11-x }

    if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]))return false

    return true
}

pet.directive('cpf', function($q, $timeout) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl){
            ctrl.$asyncValidators.cpf = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    def.reject();
                }
                var def = $q.defer();

                if(validarCpf(modelValue)){
                    def.resolve();
                } else {
                    def.reject();
                }


                return def.promise;
            }
        }
    }
});



pet.controller('EditarCtrl', function($scope, $cordovaCamera, $cordovaFileTransfer, UsuariosService, LoginService, $state, URL_API, $ionicPopup) {
   
	$scope.user = "";
    $scope.loading_img = false;

	var token = LoginService.getToken();

	$scope.token = token;

	UsuariosService.buscaUsuario(token).then(function(retorno){
		$scope.user = retorno.data[0];
	});


	$scope.imagem = function(){

		var options =   {
			quality: 50
			, destinationType: Camera.DestinationType.FILE_URI
			, sourceType: Camera.PictureSourceType.PHOTOLIBRARY
			, encodingType: Camera.EncodingType.JPEG
            , correctOrientation: true
            , allowEdit: true
		}

		$cordovaCamera.getPicture(options).then(function(fileURL) {
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
                    $scope.loading_img = false;

                    $("#imagem").val(resultado);
                    $scope.user.imagem = resultado;

                }, function(err) {
                    $scope.loading_img = false;
                    $ionicPopup.alert({
                        title: 'Atenção: '+err.status,
                        template: err.statusTxt
                    });
                    console.log(err.body);
                });

		});
	}


	$scope.editar = function(){

		var dados = $("#form-editar").serialize();

		UsuariosService.editar(dados).then(function(retorno){

			if(retorno.data.status == "sucesso"){
                $ionicPopup.alert({
                    title: 'Parabéns!',
                    template: "Dados atualizados com sucesso."
                });

			}else{
                $ionicPopup.alert({
                    title: 'Atenção:',
                    template: retorno.data.msg
                });
			}

		});

	}

	$scope.resgataEndereco = function(){

		var cep = $("#cep").val();

		console.log(cep);

		LoginService.buscaCEP(cep).then(function(retorno){

			var endereco = retorno.data;

			var logradouro = endereco.tipo_logradouro+" "+endereco.logradouro;

			var bairro = endereco.bairro;

			var cidade = endereco.cidade;

			var estado = endereco.uf;

			
			$scope.user.endereco = logradouro;

			$scope.user.bairro = bairro; 

			$scope.user.cidade = cidade;

			$scope.user.estado = estado; 





		});

	}
	

})



pet.controller('LembreteCtrl', function($scope, UsuariosService, $state){
	$scope.myModel= {};
	$scope.myModel.email = '';
	$scope.myModel.loading = false;
	$scope.goTo = function(path){
		$state.go(path);
	}
	$scope.recuperarSenha = function () {
		$scope.erro = '';
		$scope.sucesso = '';
		$scope.myModel.loading = true;
		UsuariosService.lembrete($scope.myModel.email).then(function(response){
			$scope.myModel.loading = false;
			if(response.data.status == 'erro'){
				$scope.erro = response.data.msg;
			} else {
				$scope.sucesso = response.data.msg;
			}
		});
	}
})

pet.controller('UsuariosServicoDetalhesCtrl', function($scope, UsuariosService, $state, $stateParams,LoginService,$ionicActionSheet){
	$scope.detalhes = [];
	$scope.comentarios = [];
	  $scope.myModel = {comentario:""}
	var parametro =  $stateParams.usuario_id;

	$scope.servico = $stateParams.usuario_id;

	console.log(parametro);

	var token = LoginService.getToken();

	$scope.token = token;

	UsuariosService.detalheServico(parametro,token).then(function(dados){
		$scope.detalhes = dados.data;

		var curtida = dados.data.curtida;

		if(curtida == "sim"){
			$("#curtidasim").css("color","#0fa0c4");
		}else{

			if(curtida == "não"){
				$("#curtidanao").css("color","#0fa0c4");
			}

			
		}

		console.log(dados.data);
	});

	UsuariosService.listagemComentariosPrestador(parametro).then(function(dados){
		$scope.comentarios = dados.data;
		console.log(dados.data);
	});

	$scope.curtir = function(servico,valor){



		UsuariosService.curtir(servico,token,valor).then(function(retorno){

			$scope.detalhes.curtida = retorno.data.like;
			$scope.detalhes.qtdGostei = retorno.data.qtdGostei;
			$scope.detalhes.qtdNaoGostei = retorno.data.qtdNaoGostei;

			console.log($scope.detalhes.curtida);

			if($scope.detalhes.curtida == "sim"){
				$("#curtidasim").css("color","#0fa0c4");
				$("#curtidanao").css("color","#888");
			}else{

				if($scope.detalhes.curtida == "não"){
					$("#curtidanao").css("color","#0fa0c4");
					$("#curtidasim").css("color","#888");
				}

			}



		});



	}

	$scope.cadastraComentario = function(){

		var dados = $("#form-comentario").serialize();

		console.log(dados);

		UsuariosService.cadastraComentarioPrestador(dados).then(function(retorno){

			if(retorno.data.status == "sucesso"){
				$scope.comentarios = retorno.data.comentarios;
				  $scope.myModel.comentario="";
			}else{
				alert("Houve um erro ao inserir seu comentário tente novamente mais tarde");
			}

		});
	}

	$scope.cadastraResposta = function(event){

		var dados = $(event.target).serialize();


		UsuariosService.cadastraRespostaPrestador(dados).then(function(retorno){
			if(retorno.data.status == "sucesso"){
				$scope.comentarios = retorno.data.comentarios;
				 
			}else{
				alert("Houve um erro ao inserir sua resposta tente novamente mais tarde");
			}
		});

		
	}


    $scope.favorito = function(users_servicos_id){

    	var dados = "users_servicos_id="+users_servicos_id+"&users_id="+token;

    	UsuariosService.favoritar(dados).then(function(retorno){

    		console.log(retorno);

    		if(retorno.data.status == "sucesso"){
    			$scope.detalhes.favorito = retorno.data.statusfavorito;
    		}

    	});
    } 

    $scope.triggerActionSheet = function() {

          // Show the action sheet
          var showActionSheet = $ionicActionSheet.show({
             buttons: [
                { text: '<a class="padding">Chat</a>' },
                { text: "<a class='padding'>Telefonar</a>" }
             ],
    			
            
             titleText: 'Escolha a forma de contato!',
             
    			
             cancel: function() {
                // add cancel code...
             },
    			
             buttonClicked: function(index) {
                if(index === 0) {
                   location.href="#/app/conversas/iniciar/"+$scope.detalhes.users.users_id+"/"+$scope.servico;
                }
    				
                if(index === 1) {
                   window.open("tel:"+$scope.detalhes.enderecos.telefone, '_system', 'location=yes')
                }
             },
    			
            
          });
       };



})

pet.controller('ListagemMeusServicosCtrl', function($scope,$stateParams,UsuariosService,LoginService) {
    
    var token = LoginService.getToken();

    $scope.servicos = []; 

    $scope.loading = true;

	$scope.empresas_id = $stateParams.empresa_id;


  

	UsuariosService.listagemMeusServicos($scope.empresas_id).then(function(retorno){


		$scope.servicos = retorno.data;


		 $scope.loading = false;

	});

	$scope.excluir=function(servico){

		var dados = "servico="+servico+"&token="+token+"&empresas_id="+$scope.empresas_id;


		UsuariosService.deletarMeusServicos(dados).then(function(retorno){

			$scope.servicos=retorno.data;

			 $scope.loading = false;


		});	

	}


})


pet.controller('UsuarioMensagensCtrl', function($scope, UsuariosService, $state, $stateParams) {

	$scope.mensagens= [];
	$scope.id = $stateParams.id;
	UsuariosService.getMensagens($stateParams.id).then(function(dados){
		$scope.mensagens = dados.data;

		//console.log($scope.mensagens[0].conversas[0].users.imagem);
	});


})


pet.controller('UsuarioConversasCtrl', function($scope, UsuariosService, $state, $stateParams,LoginService) {

	$scope.conversas=[];
	$scope.loading=true;
	$scope.tipo = '';

	var token = LoginService.getToken();
    var dados = "user_id="+token;

	UsuariosService.getConvesas(dados).then(function(retorno){
		$scope.conversas = retorno.data;
		$scope.loading=false;
	});

    $scope.filtrar = function(){
    	$scope.loading=true;
        var dados = "user_id="+token;
        var form = $("#filtrar").serialize();
        var dadostotal = dados+"&"+form;

        UsuariosService.getConvesas(dadostotal).then(function(retorno){
            $scope.conversas = retorno.data;
            $scope.loading=false;
        });
    }
})


pet.controller('UsuarioMensagensCtrl', function($scope, UsuariosService, $state, $stateParams) {

	$scope.mensagens= [];
	$scope.id = $stateParams.id;
	UsuariosService.getMensagens($stateParams.id).then(function(dados){
		$scope.mensagens = dados.data;

	});
});

pet.controller('UsuarioConversaIniciarCtrl', function($scope, UsuariosService, $state, $stateParams,LoginService) {
	$scope.mensagens= [];
	$scope.msg = [];
	$scope.user_id  = LoginService.getToken();
	$scope.id = $stateParams.id;
	$scope.tipo = $stateParams.tipo;
	$scope.cadastrar = function(){

		var dados = $("#inicioConversa").serialize();
		var tipos = '';
		if($scope.tipo == 1){
			tipos = "conversa";
		}else if($scope.tipo == 2){
			tipos = "doações";
		}else{
			tipos = "conversa_combinações";
		}

		UsuariosService.iniciarConversa(dados).then(function(dados){
            if(dados.data.status == "sucesso") {
                var dado = "logado="+$scope.user_id+"&sala="+dados.data.sala+"&tipo="+tipos+"&user2="+$scope.id;
                LoginService.cadastraNotificacoes(dado);
                location.href= "#/app/conversas/detalhes/"+$scope.id+"/"+dados.data.sala+"/"+$scope.tipo;
            } else {
                $scope.msg.push('Falha');
            }
		}, function errorCallback(response) {
				angular.forEach(response.data, function(value, key) {
					var valor = JSON.stringify(value);
					var formato = valor.replace(/["\[\]]/gi,'');
					$scope.msg.push(formato);
				});
			}
		);
	}
});


pet.controller('UsuarioMensagensDetalhesCtrl', function($scope, UsuariosService, $state, $stateParams,LoginService,$location,$rootScope,URL_API, $ionicScrollDelegate) {
        $scope.mensagens= [];
        $scope.user_id = '';
        $scope.msg=[];
        $scope.loading=true;
        var token = LoginService.getToken();
        $scope.id = $stateParams.id;
        $scope.id_conversa = $stateParams.id_conversa;
        $scope.tipo = $stateParams.id_tipo;
        $scope.participante = {};
        $scope.goTo = function(path){
            $state.go(path);
        }
        $scope.$watch('mensagens', function(newValue, oldValue) {
            $ionicScrollDelegate.scrollBottom(false);
        }, true);

        url = $location.path();

    $scope.$on('$ionicView.enter', function(){
        var tipos = '';
        if($scope.tipo == 1){
            tipos = "conversa";
        }else if($scope.tipo == 2){
            tipos = "doações";
        }else{
            tipos = "conversa_combinações";
        }


        LoginService.alteraStatusNotificacaoPorUrl(url,token).then(function(retorno){
            $rootScope.qtdNotification = retorno.data.quantidade;
        });


        UsuariosService.getMensagens($stateParams.id_conversa, token).then(function(dados){
            $scope.mensagens = dados.data.conversa;
            $scope.participante = dados.data.participante;
            $scope.user_id = token;
            $scope.loading=false;

        });
    });

	$scope.cadastrar = function(){
        function pad(s) { return (s < 10) ? '0' + s : s; }

        var d = new Date();
        
        $scope.mensagens.push({'mensagem': $scope.campos.texto, 'me': 1, 'imagem': '', 'nome': '', 'lida': 0, 'created_at': [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-')+' '+[pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':')});
        console.log($scope.mensagens);
		var dados = $("#cadastroMensagem").serialize();
        $scope.campos.texto = '';
		UsuariosService.cadastrarMensagem(dados).then(function(ret){
				if(ret.data.status == "sucesso"){
					var dado = "logado="+token+"&sala="+$scope.id_conversa+"&tipo="+tipos+"&user2="+$scope.id;
					LoginService.cadastraNotificacoes(dado);
				}else{
					$scope.msg.push('Falha');
				}

			},function errorCallback(response) {
				angular.forEach(response.data, function(value, key) {
					var valor = JSON.stringify(value);
					var formato = valor.replace(/["\[\]]/gi,'');
					$scope.msg.push(formato);
				});
			}
		);
	}


})

pet.controller('NovoMeusServicosCtrl', function($scope,$stateParams,UsuariosService,LoginService,ServicosService,AnimaisService) {
    
    $scope.token = LoginService.getToken();



    $scope.servicos = []; 

    $scope.tipos = [];

	$scope.empresas_id = $stateParams.empresa_id;


    AnimaisService.buscaAnimaisCategorias().then(function(retorno){

    	$scope.tipos = retorno.data;

    	console.log($scope.tipos);

    });



  

    $scope.msg = [];

    $scope.item={"seleciona":''};


    $scope.preencheServicos = function(){


    	var animal_id = $scope.item.seleciona;


    	ServicosService.getAllServicosOf(animal_id).then(function(retorno){
    		$scope.servicos = retorno.data;

    	});



    }

    $scope.cadastrar= function(){

    	var dados = $("#cadastroServico").serialize();


    	UsuariosService.cadastrarMeusServicos(dados).then(function(retorno){

    		if(retorno.data.status == "sucesso"){

    			window.location="#/app/meus-servicos/listagem/"+$scope.empresas_id;
    		
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


pet.controller('EditarMeusServicosCtrl', function($scope,$stateParams,UsuariosService,LoginService,ServicosService,AnimaisService) {
    
    $scope.token = LoginService.getToken();

    $scope.servico_id = $stateParams.servico;

	$scope.empresa_id = $stateParams.empresa_id;

    $scope.servico = "";


    
    ServicosService.getServicosAll().then(function(retorno){
    	$scope.servicos = retorno.data;

    });



    $scope.item={"seleciona":''};


    $scope.tipos = [];


    AnimaisService.buscaAnimaisCategorias().then(function(retorno){

    	$scope.tipos = retorno.data;

    	console.log($scope.tipos);

    });



    $scope.preencheServicos = function(){


    	var animal_id = servicos.tipos_id;


    	ServicosService.getAllServicosOf(animal_id).then(function(retorno){
    		$scope.servicos = retorno.data;



    	});



    }


      ServicosService.getByServices($scope.servico_id).then(function(retorno){

      	$scope.servico = retorno.data;

      });



    $scope.editar = function(){



    	var dados = $("#cadastroServico").serialize();

    	UsuariosService.editarMeusServicos(dados).then(function(retorno){

    		if(retorno.data.status == "sucesso"){
    			alert("Alteração Efetuada com Sucesso!!!");
    			location.href = "#/app/meus-servicos/listagem/"+ $scope.empresa_id;
    		}

    	});

    }




})




