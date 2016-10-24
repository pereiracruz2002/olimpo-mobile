pet.directive("autocomplete",function(){

	return {
		templateUrl: "modulos/diretivas/navbar.html",
		replace:true,
		restrict:"E",
		controller:function($scope,$element,$attrs,LoginService,UsuarioService,$state){

		 	var token = LoginService.getToken();

		 	$scope.user = "";

		 	UsuarioService.getDadosUsuario(token).then(function(retorno){

		 		$scope.user = retorno.data.dados[0];



		 		//console.log($scope.user);

		 	});

			$scope.abreMenu=function(){
                var elm = $("#menu-conteudo")
                elm.toggle();
                if(elm.is(':visible')){

                    $('#navbar').css('bottom', '0');
					$('#navbar').prependTo('body');
                } else {
                    $('#navbar').css('bottom', 'auto');
					$('#navbar').prependTo('.scroll');

                }

			}

            $scope.fechaMenu = function(){
                var elm = $("#menu-conteudo")
                elm.hide();
                $('#navbar').css('bottom', 'auto');
				$('#navbar').prependTo('.scroll');
            }


			$scope.logout = function(){
				LoginService.logout();
				$state.go("inicio");

			}



		}
	};


});
