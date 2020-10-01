<?php

$PATH='var/www/html/';

$cfg = [ 'p' => $_GET['p'],
         'debug' => $_GET['d'],
         //                'debug' => true,
         'path_root' => $PATH,
         'path_upload' => $PATH.'uploads/',
         'path_files' => $PATH.'arquivos/',
         'teste' => true,
         'url' => '',
         'full _GET'=>$_GET,
         'full _POST'=>$_POST,
         'HTTP_POST' => $HTTP_HOST,
         '_REQUEST_URI' => $REQUEST_URI,
         '_POST.path' => $_POST['path']
];

$manual = [ 'Rhizo Hermes API' => 'V0.0.3 -  default page, help',
            'License and Copyrights' => 'gplv2, some rights reserved',
            'page 0' => 'TODO manual',
            'page 1' => 'list stations',
            'page 2' => 'get user ',
            'page 3' => 'get user ',
            'page 4' => 'get user ',
            'page 5' => 'get user ',
            'page 6' => 'get user ',
            'd true' => 'debugger on HTML',
            '\--functions' => 'list of funcionalities',
            'exec get_nodename' => exec_get_nodename(),
            'exec is_running' => exec_isrunning(),
            'exec_erase_queue()' => 'not running now',
            'exec_get_systems()' => exec_get_systems(),
            'exec_get_spool_list()' => 'TODO exec_get_spool_list()',
            'exec_kill_job()' => 'TODO exec_get_spool_list()',
            'exec_decrypt()' => 'decrypt',
            'exec_restart_system()' => '',
            'exec_shutdown()' => '',
            'exec_viewlog()' => '',
            'exec_listfiles()' => 'TODO',
            'exec_viewjob()' => '',
            '--' => '--',
            '' => '',
];

$x = _GET['x'];

include("api_cfg.php");

switch ($cfg['p']) {
  case "test":
      $out = exec_get_nodename();
      $out2 = explode("\n",$out);
      $data = [ 'output' => $out2 ];
      break;
  case "1" :
      $data = [ 'pagina' => '1', 'teste' => TRUE, 'texto' => exec_cli("ls -l") ];
      //    ob_start();
      break;
  case "2":
      $data = [ 'pagina' => '2', 'teste' => TRUE, 'texto' => "pagina 2" ];
      break;
case "3": // get nodename
    $out = [ 'output' => exec_cli("egrep -v '^\s*#' /etc/uucp/config | grep nodename | cut -f 2")];
    $data = explode("\n",$out);
    break;

    $x1 =  explode("\n",$x);
    $out = [ 'output' => exec_cli($x1)];
    $data = explode("\n",$out);
    break;
default:
      //$out = get_uname();
      $data = [ 'Terms and usage' => $manual,  'pagina' => 'default or command not accepet', 'uname' => $out,  'cfg' => $cfg, ];
      break;
}

if ($cfg['debug']=="true" ){
    echo "<h2>Hermes API Debugger on</h2>";
    echo "<h3>\$cfg</h3>";
    var_dump($cfg);
    echo "<h4>json</h4>";
    echo json_encode( [$cfg] );
    echo "<h3>\$data</h3>";
    var_dump( $data);
    echo "<h4>json</h4>";
    echo json_encode( [$cfg] );
}
else {
    header('Content-type: application/json');
    //    echo json_encode( [$cfg,$data] );
    echo json_encode( [$data] );
}

//run external commands
function exec_cli($command)
{
    ob_start();
    system($command , $return_var);
    $output = ob_get_contents();
    ob_end_clean(); //or die;

    /*if ($exploder==true){
            return (explode("\n", $output));
            }*/

    return ($output);
}

//old script get_nodename.sh
function exec_get_nodename()
{
    $command = "egrep -v '^\s*#' /etc/uucp/config | grep nodename | cut -f 2";
    return exec_cli($command);
}

function exec_isrunning(){
    exec("pgrep -x uuardopd", $piduu);
    exec("pgrep -x ardop", $pidar);
    if(empty($piduu) || empty($pidar)){
        //Sistema com Problemas!;
        return false;
    } else {
        //Sistema Funcionando!;
        return true;
    }
}

//TODO parametro grupo
function exec_erasequeue(){
    $command = "sudo uustat -u www-data -K";
    //TODO ? repeated?
    //$command = "sudo uustat -u uucp -K";
    $output = exec_cli($command);
    ob_start();
    system($command , $return_var);
    $output = ob_get_contents();
    ob_end_clean();

    $command = "sudo uustat -u root -K";
    $output = exec_cli($command);
    //TODO
    return [$output,$output2,$output3] ;
}

//old script get_systems.sh
function exec_get_systems(){
    //TODO
    $command = "egrep -v '^\s*#' /etc/uucp/sys | grep alias | cut -f 2 -d \" \"";
    $output = exec_cli($command);
    $sysnames = explode("\n", $output);
    //TODO
    $sysnameslist=[];

    for ($i = "0" ; $i < count($sysnames); $i++) {
        if(!empty($sysnames[$i])) {
            //echo $sysnames[$i];
            //TODO adicionar elemento
            array_push($a, sysnames[$i]);
        }
    }
    return [ $sysnames,$sysnameslist ];
}

function exec_load_file(){
    $command = "uustat -a| cut -f 2,7,8,9 -d \" \" | sed \"s/\/var\/www\/html\/uploads\///\"";
        exec_cli($command);
}

//decrypt
function exec_decrypt(){
    $path = $_POST['path'];
    $dec_subdir=dirname($path)."/dec/";
    mkdir($dec_subdir, 0777, TRUE);
    $outfile=$dec_subdir.basename($path,".gpg");
    //TODO
    $command = "decrypt.sh ".$path." ".$outfile." ".$_POST['password'];
    $output = exec_cli($command);

    if ($return_var == 0){
        $prefix = '/var/www/html/';

        if (substr($outfile, 0, strlen($prefix)) == $prefix) {
            $str = substr($outfile, strlen($prefix));
        }
        //correct password
        //TODO  // basename($str);
        return $str;
    } else {
        // wrong password

        unlink($outfile);
        return FALSE;
    }
}

//fila de transmissao
//port spool_list
function exec_get_spool_list(){
    $command = "uustat -a| cut -f 2,7,8,9 -d \" \" | sed \"s/\/var\/www\/html\/uploads\///\"";
    //TODO fix path in sed $cfg['path_uploads'])
    //  $command = "uustat -a| cut -f 2,7,8,9 -d \" \" | sed \"s/\/var\/www\/html\/uploads\///\"";
    $output=exec_cli($command) or die;
    return($output);
}

//TODO
function exec_kill_job(){
    $command = "kill_job.sh";
    $output=exec_cli($command) or die;
    return $output;
}

//TODO
// Open a directory, and read its contents
function exec_list_files($path){

    //TODO $path?
    if (is_dir($cfg['path_files'])){
        if ($dh = opendir($cfg['path_files'])){
            while (($file = readdir($dh)) !== false){
                if ($file == '.' || $file == '..') {
                    continue;
                }

                //TODO to array
                $data = [ '$file' => '2', $file ];
                return $data;
            }
            closedir($dh);
        }
    }
}

function exec_list_job(){
    //TODO fix sed
    $command = "uustat -a| cut -f 2,7,8,9 -d \" \" | sed \"s/\/var\/www\/html\/uploads\///\"";
    $output = exec_cli($command);
    echo $output;
}

//port script restart_system.sh
function exec_restart_system(): bool{
    $command = "sudo systemctl stop uuardopd";
    $output0 = exec_cli($command);

    $command = "sudo systemctl stop ardop";
    $output1 = exec_cli($command);

    //TODO sleep php
    $command = "sleep 1";
    $output2 = exec_cli($command);

    $command = "sudo systemctl start ardop";
    $output3 = exec_cli($command);

    $command = "sudo systemctl start uuardopd" ;
    $output4 = exec_cli($command);

    //TODO
    return [$output0,$output1,$output2,$output3,$output4,$output5];
}

function exec_shutdown(){
    $command = "sudo halt";
    exec_cli($command);
}

function exec_viewlog(){
    $command = "uulog|tail";
    $output=exec_cli($command);
    return $output;
}

//TODO
//alias.sh bash contents
/*
 * oline=$(grep -n $1 /etc/uucp/sys|cut -d ':' -f 1)
 *  linePlus=$((line+1))
 *  #echo $line
 *  name=$(head -$linePlus /etc/uucp/sys|tail -1|cut -d ' ' -f 2)
 *  echo -n $name
 */


/**
//TODO
function receive(){
    $dir = '/var/www/html/arquivos/';
    $files = scandir($dir);

    foreach($files as $key => $value){
        $path = realpath($dir.DIRECTORY_SEPARATOR.$value);
        if(is_dir($path) && $value != "." && $value != "..") {
            echo "<div class=\"body\">Arquivos de Origem da Estação ".$value."</div><br />";
            $files_st = scandir($dir.DIRECTORY_SEPARATOR.$value);
            $class="bodywt";
            foreach($files_st as $key_st => $value_st){
                $path_st = realpath($dir.DIRECTORY_SEPARATOR.$value.DIRECTORY_SEPARATOR.$value_st);
                if(!is_dir($path_st)) {
                    $file_ext = pathinfo($path_st, PATHINFO_EXTENSION);
                    if ($class == "bodywt"){
                        echo "<div class=\"bodywt\">";
                        $class="body";
                    } else {
                        echo "<div class=\"body\">";
                        $class="bodywt";
                    }
                    if ($file_ext=="gpg") {
                        echo $value_st;
                        echo "<form action=\"decrypt.php\" method=\"post\" enctype=\"multipart/form-data\" style=\"display: inline;\">";
                        echo "<br />Senha: ";
                        echo "<input type=\"text\" name=\"password\" />";
                        echo "<input type=\"submit\" value=\"Abrir com Senha\" name=\"submit\" />";
                        echo "<input type=\"hidden\" name=\"path\" value=\"".$path_st."\" />";
                        echo "</form>";
                    }
                    else {
                        echo "<a href=\"arquivos/".$value."/".$value_st."\">".$value_st."</a>";
                    }
                    // echo "<br />";
                    echo "</div>";
}
                // $results[] = $path;
            }
        }
    }

    if ($class == "bodywt"){
        echo "<div class=\"bodywt\">";
    } else {
        echo "<div class=\"body\">";
    }

    echo "<a href=\"clean_files.php\"><i class=\"material-icons\">cancel</i>
Limpar Todos Arquivos</a>";

    echo "</div>";

}

function upload(){
    $target_dir = "/var/www/html/uploads/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $remote_dir = "/var/www/html/arquivos/";
    $uploadPic = 0;
    $uploadOk = 1;
    $file_in_place = 0;

    // IMAGE SECTION //
    $source = substr ($_POST['myname'], 0,  6);

    if ($source == $_POST['prefix'])
    {
        echo "ERRO: Estação de origem é igual estação de destino! <br />";
        exit;
    }

    $cmd= "alias.sh ".substr ($_POST['myname'], 0,  6);
    $source = shell_exec($cmd);
    // echo $cmd." <br />";
    if ($source == $_POST['prefix'])
    {
        echo "ERRO: Estação de origem é igual estação de destino! <br />";
        exit;
    }

    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

    // Check if image file is a actual image or fake image
    if(isset($_POST["submit"])) {
        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
        if($check !== false) {
            //        echo "File is an image - " . $check["mime"] . ".";
            $uploadPic = 1;
            $uploadOk = 1;
        } else {
            //        echo "File is not an image. Proceding normally";
            $uploadOk = 1;
            $uploadPic = 0;
        }
    }
    // Check if file already exists
    if (file_exists($target_file)) {
        //    echo "Sorry, file already exists, cotinuing...";
        $uploadOk = 1;
    }


    // Image but not jpg case
    if($imageFileType != "jpg" && $imageFileType != "JPG" && $imageFileType != "jpeg"
       && $imageFileType != "JPEG" && $uploadPic == 1) {
        if (($_FILES["fileToUpload"]["size"] > 50*1024) && $uploadPic == 1 ) {
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file))
            {
                $arr = explode("." . $imageFileType, $target_file);
                $new_target = $arr[0] . ".jpg";
                $command = "compress_image.sh \"" .  $target_file . "\" \"" . $new_target . "\"";
                //          echo "Command: " . $command . "<br />";
                ob_start();
                system($command , $return_var);
                ob_end_clean();
                unlink($target_file);
                $target_file = $new_target;
                $uploadOk = 1;
                $file_in_place = 1;
            } else {
                $uploadOk = 0;
                echo "Erro ao mover o arquivo para pasta temporária. <br />";
            }

        }
    }

    // Check file size and if it is picture, reduce the size...
    // limit not to reduce size is 50k!
    if (($_FILES["fileToUpload"]["size"] > 50*1024) && $uploadPic == 1 && $file_in_place == 0 && $uploadOk == 1) {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            $command = "compress_image.sh \"" .  $target_file . "\"";
            //        echo "Command: " . $command . "<br />";
            ob_start();
            system($command , $return_var);
            ob_end_clean();
            $uploadOk = 1;
            $file_in_place = 1;
        } else {
            $uploadOk = 0;
            echo "Erro ao mover o arquivo para pasta temporária. <br />";
        }
    }

    // Check file size of a normal file.
    // limit is 50k!
    if (($_FILES["fileToUpload"]["size"] > 50*1024) && $uploadPic == 0 ) { // 10MB max
        echo "Arquivo muito grande. Máximo permitido: 51200 bytes, tamanho do arquivo: " . $_FILES["fileToUpload"]["size"] . " bytes.<br />";
        $uploadOk = 0;
    }

    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        //    echo "Erro no pré-processamento do arquivo.<br />";
        // if everything is ok, try to upload file
    } else {
        if ($file_in_place == 0)
        {
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                $file_in_place = 1;
            }
            else {
                echo "Erro ao mover o arquivo para pasta temporária. <br />";
                $uploadOk = 0;
            }
        }

        if (isset($_POST['encrypt']) && $file_in_place == 1)
        {
            $command = "encrypt.sh \"" . $target_file . "\" \"" . $_POST['password'] . "\"";
            //           echo "encrypt command: " . $command . "<br />";
            ob_start();
            system($command , $return_var);
            $output = ob_get_contents();
            ob_end_clean();
            unlink($target_file);
            $target_file = $target_file . ".gpg";
            //           echo "Criptografia ativada!<br />";
        }

        if ($file_in_place == 1) {
            if (isset($_POST['sendnow']))
            {
                $command = "uucp -C -d \"" .  $target_file . "\" " . $_POST['prefix'] . "\!\"" . $remote_dir . $source . "/\"";
                echo "Arquivo <b>".basename($target_file)."</b> adicionado com sucesso e transmissão iniciada.<br />";
            } else
            {
                $command = "uucp -r -C -d \"" .  $target_file . "\" " . $_POST['prefix'] . "\!\"" . $remote_dir . $source . "/\"";
                echo "Arquivo <b>".basename($target_file)."</b> adicionado com sucesso.<br />";

            }
            //           echo "UUCP Command: " . $command . "<br />";
            ob_start();
            system($command , $return_var);
            $output = ob_get_contents();
            ob_end_clean();
        }
    }
    unlink($target_file);
}
**/

