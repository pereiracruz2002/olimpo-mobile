<?php
class Build
{
    var $projectName = 'PetFans';

    public function __construct()
    {
        $this->removeOldRelease();
        $this->updateVersion();
    }

    public function run()
    {
        exec('cordova build --release android');
        exec('jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk alias_name');
        exec('zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk '.$this->projectName.'.apk');
    }

    public function removeOldRelease()
    {
        if(file_exists($this->projectName.'.apk')){
            unlink($this->projectName.'.apk');
        }
    }

    public function updateVersion()
    {
        $filename = "config.xml";
        $handle = fopen ($filename, "r");
        $conteudo = fread ($handle, filesize ($filename));
        fclose ($handle);
        preg_match('/version="[0-9].[0-9].[0-9]"/', $conteudo, $values);
        $versao_atual = $values[0];
        $versao = explode('.', substr(str_replace('version="', '', $versao_atual), 0, -1));
        $versao[2]++;
        if($versao[2] == 99){
            $versao[2] = 0;
            $versao[1]++;
        }
        if($versao[1] == 99){
            $versao[1] = 0;
            $versao[0]++;
        }
        $nova_versao = 'version="'.implode($versao, '.').'"';
        $novo_conteudo = str_replace($versao_atual, $nova_versao, $conteudo);

        $fp = fopen($filename, 'w');
        fwrite($fp, $novo_conteudo);
        fclose($fp);
    }
}
$build = new Build();
$build->run();
