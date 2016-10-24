pet.run(function($ionicPlatform,$ionicHistory,$rootScope,$state,LoginService,$location,$ionicPopup,URL_API) {

    $rootScope.qtdNotification = 0;
    $rootScope.rootModel={
        'perfil': ''
    };


  	$ionicPlatform.registerBackButtonAction(function () {
        if ($state.current.name == "app.animais" || $state.current.name == "login") {
          // do something for this state
           navigator.app.exitApp();
        } else {
          navigator.app.backHistory();
        }
    }, 100);
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);



    }
    if(window.StatusBar) {
        StatusBar.styleDefault();
    }


  
  document.addEventListener('deviceready', function () {
    // Enable to debug issues.
    // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});


    
    var notificationOpenedCallback = function(jsonData) {
      //console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));


      if(jsonData.additionalData.tipo == "mensagem"){
        console.log(jsonData.additionalData.quantidadeNotificacoes);

        if(jsonData.additionalData.site != $location.path()){
         $rootScope.qtdNotification = jsonData.additionalData.quantidadeNotificacoes;

         $rootScope.$apply();

        }else{
            if(LoginService.getToken() != null){

                var token = LoginService.getToken();

                var id = jsonData.additionalData.notificacao;

                LoginService.alteraStatusNotificacao(id,token).then(function(retorno){
                     $rootScope.qtdNotification = retorno.data.quantidade;
                       //$rootScope.$apply();
                });

            }

        }

        

      }


      if(jsonData.additionalData.tipo == "combinação"){

        if(jsonData.additionalData.site != $location.path()){
         $rootScope.qtdNotification = jsonData.additionalData.quantidadeNotificacoes;

         $rootScope.$apply();

         var imagem = URL_API+"uploads/"+jsonData.additionalData.imagem;

         var mensagemPopup = jsonData.additionalData.mensagemPopup;

         var html = "<article>";
        html+="<p>"+mensagemPopup+"</p>";
         html+="<figure>";
         html+="<img src='"+imagem+"'>";
         html+="</figure>";
         html +="</article>";

        
           var confirmPopup = $ionicPopup.confirm({
            title: 'Nova Combinação',
            template: html,
            cancelText: 'Não',
             okText:'Sim'
           });

           confirmPopup.then(function(res) {
             if(res) {
               location.href="#"+jsonData.additionalData.site;
             } else {
               
             }
           });
         

        }else{
            if(LoginService.getToken() != null){

                console.log("entrou no login");
                var token = LoginService.getToken();

                var id = jsonData.additionalData.notificacao;

                LoginService.alteraStatusNotificacao(id,token).then(function(retorno){
                     $rootScope.qtdNotification = retorno.data.quantidade;
                       //$rootScope.$apply();
                });

            }


        }

        

      }
     
    
    };

    /*didReceiveRemoteNotificationCallBack = function(jsonData) {
      alert("Notification received:\n" + JSON.stringify(jsonData));
      console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    }*/

    window.plugins.OneSignal.init("18277e6e-afc4-4936-ab8b-0fd31cb80a30",
                                   {googleProjectNumber: "825917432096",
                                    autoRegister: true},
                                   notificationOpenedCallback);


    window.plugins.OneSignal.setLogLevel({logLevel: window.plugins.OneSignal.LOG_LEVEL.ERROR, visualLevel: window.plugins.OneSignal.LOG_LEVEL.NONE});

    //window.plugins.OneSignal.setSubscription(true);

    window.plugins.OneSignal.enableInAppAlertNotification(false);
    
    // Show an alert box if a notification comes in when the user is in your app.
    // window.plugins.OneSignal.enableInAppAlertNotification(true);
  }, false);



  var routespermission = ['/','/cadastro/','/lembrete/','/forgot-password/'];

  $rootScope.previousState = {};
  $rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
        // store previous state in $rootScope
        $rootScope.previousState.name = fromState.name;
        $rootScope.previousState.params = fromParams;
    });

  $rootScope.$on('$stateChangeStart', function() {



   if(routespermission.indexOf($location.path()) == -1){

       if(!localStorage.getItem('pet-token')){
           $location.path('/');
       }
   }

   if($location.path() == "/"){

     if(localStorage.getItem('pet-token') != null){

       $location.path('/animais/');

   }


}

});



});



})
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

    $ionicConfigProvider.views.forwardCache(true);
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.navBar.alignTitle('center');

    $stateProvider.state('login', {
        url: '/',
        templateUrl:'modulos/inicio/views/inicio.html',
        controller: 'InicioCtrl'
    });

    $stateProvider.state('cadastro', {
        url: '/cadastro/',
        templateUrl:'modulos/usuarios/views/cadastro.html',
        controller: 'CadastroServicoCtrl'
    });

    $stateProvider.state('forgot-password', {
        url: '/forgot-password/',
        templateUrl:'modulos/usuarios/views/lembrete.html',
        controller: 'LembreteCtrl'
    });

    $stateProvider.state('home', {
        url: '/home/',
        templateUrl:'modulos/inicio/views/home.html',
        controller: 'HomeCtrl'
    });

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'view/menu.html',
        controller: 'AppCtrl'
    });

    $stateProvider.state('app.meus', {
        url: '/meus-animais/',
        views: {
            'menuContent': {
                templateUrl: 'modulos/animais/views/listagem-meus-animais.html',
                controller: 'MeusAnimaisCtrl'
            }
        }     
    });

    $stateProvider.state('app.animais', {
        url: '/animais/',
        views: {
            'menuContent': {
                templateUrl: 'modulos/animais/views/listagem.html',
                controller: 'AnimaisCtrl'
            }
        }     
    });


    $stateProvider.state('app.meus_novo', {
        url: '/meus-animais/novo',
        views: {
            'menuContent': {
                templateUrl: 'modulos/animais/views/novo-meus-animais.html',
                controller: 'MeusAnimaisNovoCtrl'
            }
        }     
    });


    $stateProvider.state('app.meus-servicos', {
        url: '/meus-servicos/listagem/:empresa_id',
        views: {
            'menuContent': {
                templateUrl: 'modulos/usuarios/views/listagem-meus-sevicos.html',
                controller: 'ListagemMeusServicosCtrl'
            }
        }     
    });


    $stateProvider.state('app.meus-servicos_editar', {
        url: '/meus-servicos/editar/:servico/:empresa_id',
        views: {
            'menuContent': {
                templateUrl:'modulos/usuarios/views/editar-meus-servicos.html',
                controller: 'EditarMeusServicosCtrl'
            }
        }     
    });



    $stateProvider.state('app.servicos_favoritos', {
        url: '/favoritos',
        views: {
            'menuContent': {
                templateUrl:'modulos/servicos/views/listagem_favoritos.html',
                controller: 'ServicosFavoritosCtrl'
            }
        }     
    });


    $stateProvider.state('app.buscar_servico', {
        url: '/buscaServicos',
        views: {
            'menuContent': {
                templateUrl:'modulos/servicos/views/form_busca.html',
                controller: 'BuscarServicos'
            }
        }     
    });

    $stateProvider.state('app.resultado_buscar_servico', {
        url: '/resultadoBuscaServicos',
        params: {
            'tipo': '', 
            'categoria': '', 
            'tipo_busca': '', 
            'cep': '', 
            'distancia':''
        },
        views: {
            'menuContent': {
                templateUrl:'modulos/servicos/views/listagem_busca.html',
                controller: 'ResultadoBuscarServicos'
            }
        }
    });


    $stateProvider.state('app.doacoes', {
        url: '/doacoes',
        views: {
            'menuContent': {
                templateUrl: 'modulos/doacoes/views/doacoes.html',
                controller: 'ListagemDoacoesCtrl'
            }
        }     
    });


    $stateProvider.state('app.editar', {
        url: '/editar/',
        views: {
            'menuContent': {
                templateUrl: 'modulos/usuarios/views/editar.html',
                controller: 'EditarCtrl'
            }
        }     
    });


    $stateProvider.state('app.meus-servicos_novo', {
        url: '/meus-servicos/novo/:empresa_id',
        views: {
            'menuContent': {
                templateUrl: 'modulos/usuarios/views/novo-meus-servicos.html',
                controller: 'NovoMeusServicosCtrl'
            }
        }     
    });


    $stateProvider.state('app.meus-animais_editar', {
        url: '/meus-animais/editar/:id',
        views: {
            'menuContent': {
                templateUrl: 'modulos/animais/views/editar-meus-animais.html',
                controller: 'MeusAnimaisEditarCtrl'
            }
        }     
    });




    $stateProvider.state('app.servicos_listagem', {
        url: '/servicos/:id',
        views: {
            'menuContent': {
                templateUrl: 'modulos/servicos/views/listagem.html',
                controller: 'ServicosCtrl'
            }
        }     
    });


    $stateProvider.state('app.usuariosServico', {
        url: '/usuarios/servico/:servico_id',
        views: {
            'menuContent': {
                templateUrl: 'modulos/usuarios/views/listagem.html',
                controller: 'UsuariosServicoCtrl'
            }
        }     
    });


    $stateProvider.state('app.usuariosServicoDetalhes', {
        url: '/usuarios/detalhe/:usuario_id',
        views: {
            'menuContent': {
                templateUrl: 'modulos/usuarios/views/detalhes.html',
                controller: 'UsuariosServicoDetalhesCtrl'
            }
        }     
    });

    $stateProvider.state('app.conversas', {
        url: '/conversas',
        cache:false,
        views: {
            'menuContent': {
                templateUrl: 'modulos/usuarios/views/conversas.html',
                controller: 'UsuarioConversasCtrl'
            }
        }
    });

    $stateProvider.state('app.usuariosMensagens', {
        url: '/usuarios/mensagens/:id',
        cache:false,
        views: {
            'menuContent': {
                templateUrl: 'modulos/usuarios/views/usuario_mensagens.html',
                controller: 'UsuarioMensagensCtrl'
            }
        }     
    });


    $stateProvider.state('app.usuariosMensagensDetalhes', {
        url: '/conversas/detalhes/:id/:id_conversa/:id_tipo',
        cache:false,
        views: {
            'menuContent': {
                templateUrl: 'modulos/usuarios/views/usuario_mensagens_detalhes.html',
                controller: 'UsuarioMensagensDetalhesCtrl'
            }
        }     
    });

    $stateProvider.state('app.iniciarMensagens', {
        url: '/conversas/iniciar/:id/:tipo',
        cache:false,
        views: {
            'menuContent': {
                templateUrl: 'modulos/usuarios/views/usuario_conversa_iniciar.html',
                controller: 'UsuarioConversaIniciarCtrl'
            }
        }     
    });


    $stateProvider.state('app.encontros_matches', {
        url: '/encontros/matches/:id',
        cache:false,
        views: {
            'menuContent': {
                templateUrl: 'modulos/animais/views/listagem-encontros-matches.html',
                controller: 'encontrosMatchesCtrl'
            }
        }     
    });



    $stateProvider.state('app.encontros', {
        url: '/encontros/:id',
        cache:false,
        views: {
            'menuContent': {
                templateUrl: 'modulos/animais/views/listagem-encontros.html',
                controller: 'encontrosCtrl'
            }
        }     
    });

    $stateProvider.state('app.encontros_detalhes_matches', {
        url: '/encontros/detalhes_matches/:id/:meuAnimal',
        cache:false,
        views: {
            'menuContent': {
                templateUrl: 'modulos/animais/views/detalhes_matches.html',
                controller: 'encontrosDetalhesMatchesCtrl'
            }
        }     
    });

    $stateProvider.state('app.doacoes_novo', {
        url: '/doacoes/novo',
        views: {
            'menuContent': {
                templateUrl: 'modulos/doacoes/views/doacoes_novos.html',
                controller: 'NovaDoacoesCtrl'
            }
        }     
    });

    $stateProvider.state('app.doacoes_editar', {
        url: '/doacoes/editar/:id',
        views: {
            'menuContent': {
                templateUrl: 'modulos/doacoes/views/editar-doacoes.html',
                controller: 'DoacoesEditarCtrl'
            }
        }     
    });

    $stateProvider.state('app.doacoes_disponiveis', {
        url: '/doacoes/disponiveis',
        cache:false,
        views: {
            'menuContent': {
                templateUrl: 'modulos/doacoes/views/doacoes_disponiveis.html',
                controller: 'DoacoesDisponiveisCtrl'
            }
        }     
    });

    $stateProvider.state('app.doacoes_detalhes', {
        url: '/doacoes/detalhes/{id}',
        views: {
            'menuContent': {
                templateUrl: 'modulos/doacoes/views/doacoes_detalhes.html',
                controller: 'DoacoesDetalhesCtrl'
            }
        }     
    });


    $stateProvider.state('app.doacoes_interessados', {
        url: '/doacoes/interessados/{id}',
        cache:false,
        views: {
            'menuContent': {
                templateUrl: 'modulos/doacoes/views/doacoes_interessados.html',
                controller: 'DoacoesInteressadossCtrl'
            }
        }     
    });

    $stateProvider.state('app.empresas', {
        url: '/empresas',
        views: {
            'menuContent': {
                templateUrl: 'modulos/empresas/views/empresas.html',
                controller: 'EmpresasCtrl'
            }
        }
    });


    $stateProvider.state('app.empresas_listagem', {
        url: '/empresas/listagem',
        views: {
            'menuContent': {
                templateUrl: 'modulos/empresas/views/listagem.html',
                controller: 'EmpresasListagemCtrl'
            }
        }
    });

    $stateProvider.state('app.empresas_editar', {
        url: '/empresas/editar/:empresa_id',
        views: {
            'menuContent': {
                templateUrl: 'modulos/empresas/views/empresas_editar.html',
                controller: 'EmpresasEditarCtrl'
            }
        }
    });


    $stateProvider.state('app.notificacoes', {
        url: '/notificacoes',
        cache:false,
        views: {
            'menuContent': {
                templateUrl: 'modulos/usuarios/views/notificacoes.html',
                controller: 'NotificacoesCtrl'
            }
        }
    });


    $stateProvider.state('app.reclamacao', {
        url: '/reclamacao',
        views: {
            'menuContent': {
                templateUrl: 'modulos/reclamacao/views/reclamacao.html',
                controller: 'ReclamacaoCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/');
});

pet.filter('formata_datetime', function(){
    return function(msg) {
        var data_time = msg.split(' ');
        var data = data_time[0].split('-');
        return data[2]+"/"+data[1]+'/'+data['0'] +' - '+data_time[1].substr(0,5);
    }
});

pet.filter('concatenaservidor',function(URL_API){
    return function(texto){
        return URL_API+"uploads/"+texto;
    }
});

