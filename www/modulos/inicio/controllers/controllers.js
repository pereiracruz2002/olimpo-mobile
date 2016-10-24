pet.controller('AppCtrl', function($scope,LoginService,$state,$rootScope,$ionicHistory,UsuariosService,$ionicSideMenuDelegate, $ionicActionSheet) {
    var token = LoginService.getToken();

    $scope.myModel = {};

    LoginService.listaNotificacoes(token).then(function(retorno){
        $rootScope.qtdNotification = retorno.data.quantidade;
    });
    var perfis = {
        'usuario': 'Usuário',
        'empresa': 'Empresa'
    }
    $scope.perfilText = function(perfil)
    {

        return perfis[perfil];
    }

    UsuariosService.buscaUsuario(token).then(function(retorno){
      $rootScope.rootModel.perfil = retorno.data[0].perfil;
    });


    $scope.mudaPerfil = function(){
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                {value: 'usuario', text: 'Usuário'},
                {value: 'empresa', text: 'Empresa'}
            ],
            destructiveText: '',
            titleText: 'Usar aplicativo como:',
            cancelText: 'Cancelar',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index, button) {

                var perfil = button.value;
                var dados = "token="+token+"&perfil="+perfil;
                $rootScope.rootModel.perfil = button.value;

                LoginService.updatePerfil(dados).then(function(retorno){

                  if(retorno.data.status == "sucesso"){
                     if(retorno.data.perfil == "usuario"){
                        $ionicSideMenuDelegate.toggleLeft();
                        $state.go('app.animais');
                     }

                     if(retorno.data.perfil == "empresa"){
                        $ionicSideMenuDelegate.toggleLeft();
                        $state.go('app.empresas_listagem');
                     }
                  }
                });
                return true;
            }
        });

    }

  $scope.logout= function(){
      LoginService.logout();
      $state.go("login");
  };
 

})

pet.controller('HomeCtrl', function($scope,$rootScope, $state, UsuariosService, LoginService) {

    $scope.selecionarPerfil = function(perfilData)
    {
        $rootScope.rootModel.perfil = perfilData;
        var token = LoginService.getToken();
        var dados = "token="+token+"&perfil="+perfilData;
        LoginService.updatePerfil(dados);

        if(perfilData == 'usuario') {
            $state.go('app.animais');
        } else {
            $state.go('app.empresas_listagem');
        }
    }
    
});
pet.controller('InicioCtrl', function($scope,LoginService,$state, $timeout, $log,UsuariosService, $ionicPopup) {
    var _self = this;
    $scope.myModel = {};

    if(LoginService.getToken()){
        $scope.myModel.loading = true;
        UsuariosService.buscaUsuario(LoginService.getToken()).then(function(retorno){
            retorno.data[0].perfil

            if(retorno.data[0].perfil == "usuario"){
                $state.go('app.animais');
            }

            if(retorno.data[0].perfil == "empresa"){
                $state.go('app.empresas_listagem');
            }
        });
    }

    $scope.user = {
        username:'',
        password:''
    }
    $scope.fbLogin = true;

    $scope.login = function(){

        var dados = $("#form-login").serialize();
        $scope.myModel.loading = true;

        LoginService.loginSimple(dados).then(function(retorno){
            if(retorno.data.status == "sucesso"){
                LoginService.setToken(retorno.data.token);
                _self.updatePosition();
                window.plugins.OneSignal.getIds(function(ids) {
                    var userid = ids.userId;
                    var push = ids.pushToken;
                    var dados = "player_id="+userid+"&pushtoken="+push+"&token="+retorno.data.token;

                    LoginService.AtualizaDadosUsuario(dados);
                    $state.go('home');
                    
                });
                
            }else{
                $scope.myModel.loading = false;
                $ionicPopup.alert({
                    title: 'Atenção:',
                    template:  retorno.data.msg 
                });
            }
        }, function(retorno){
            $ionicPopup.alert({
               title: 'Erro '+retorno.status,
               template:  retorno.statusText
            });
        });
    }

    $scope.facebookLogin = function () {
        $scope.myModel.loading = true;
        facebookConnectPlugin.login(['email'], function (data) {
            LoginService.fbLogin(data.authResponse.accessToken).then(function(result){
                if(result.data.status == 'ok'){
                    LoginService.setToken(result.data.token);
                    _self.updatePosition();
                    window.plugins.OneSignal.getIds(function(ids) {
                        var userid = ids.userId;
                        var push = ids.pushToken;
                        var dados = "player_id="+userid+"&pushtoken="+push+"&token="+result.data.token;

                        LoginService.AtualizaDadosUsuario(dados);
                        $state.go('home');
                        
                    });
                } else {
                    $scope.myModel.loading = false;
                    $ionicPopup.alert({
                       title: 'Atenção:',
                       template:  'Não foi possível entrar com seu Facebook'
                    });

                }
            });
        }, function (data) {
            $scope.myModel.loading = false;
            $ionicPopup.alert({
               title: 'Atenção:',
               template:  'Não foi possível entrar com seu Facebook'
            });

        });
    };

    _self.updatePosition = function () {
        navigator.geolocation.getCurrentPosition(function(position){
            LoginService.updatePosition(position.coords).then();
        },
        function (error){
            alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
        });
    };


})


pet.controller('NotificacoesCtrl', function($scope,LoginService,$state,$rootScope,$ionicHistory) {


  var token = LoginService.getToken();

  $scope.notificacoes = [];

  $scope.loading = true;

  var inicio = 0;

  var quantidade = 10; 


  LoginService.listaNotificacoes(token,inicio,quantidade).then(function(retorno){
      $scope.notificacoes = retorno.data.notificacoes;
      $scope.loading=false;
      inicio =  inicio + quantidade;
  });


  $scope.mostrar = function(){
    $scope.loading=true;
    LoginService.listaNotificacoes(token,inicio,quantidade).then(function(retorno){
        if(retorno.data.notificacoes.length == 0){
          $('#mostrar').hide();
          $scope.loading=false;
        }else{
          for (notificacao in retorno.data.notificacoes ) {
             $scope.notificacoes.push(retorno.data.notificacoes[notificacao]);
          };

          var htmlmostrar =  $('#mostrar');


          $("#listagem").append(htmlmostrar);
          $scope.loading=false;
          inicio =  inicio + quantidade;

        }

    });

  }

  $scope.alteraStatus = function(id,url){
    LoginService.alteraStatusNotificacao(id,token).then(function(retorno){
      if(retorno.data.status == "sucesso"){
        $rootScope.qtdNotification = retorno.data.quantidade;
        location.href = "#"+url;
      }
    });
  }
})
