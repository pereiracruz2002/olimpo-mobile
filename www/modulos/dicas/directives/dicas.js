pet.directive("dica",function(){
    return {
        templateUrl: "modulos/dicas/views/card.html",
        replace:true,
        restrict:"E",
        controller:function($scope,$element,$attrs, DicasService, $cordovaSocialSharing){
            $scope.noticia = {};
            DicasService.getDicaDoDia().then(function(result){
                $scope.noticia = result.data;
            });
            $scope.compartilhar = function(titulo, url){
                msg = 'Achei interessante '+url;
                $cordovaSocialSharing.share(msg, titulo, null, null);
            }
            $scope.openLink = function(url)
            {
                window.open(url, '_system', 'location=yes');
            }
            $scope.gostei = function(id)
            {
                DicasService.gostei(id);
            }
        }
    }
});
