#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use utf8;
use DBI;

# Crear objeto CGI
my $cgi = CGI->new;
my $nombre = $cgi->param('arc');
# Imprimir encabezado HTTP
print $cgi->header('text/html');
my $ruta_completa ="../entry/$nombre";
open (my $archivo , "<", $ruta_completa) or die "ERROR : No se puedo abrir el archivo";



# Imprimir inicio del HTML
#print <<HTML;
#<!DOCTYPE HTML>
#<html>
#<head>
#   <meta charset="utf-8">
#    <title>Mis páginas wiki</title>
#</head>
#<body>
    print "<h1>$nombre</h1>";
    #HTML
while(my $line = <$archivo>){
  if(($line =~ /```/)){
    my $codigo = "```";
        while ($line = <$archivo>) {
            last if $line =~ /```/;
            $codigo .= $line."<br></br>";
        }
        $codigo.="```";
        #print "$codigo";
        my $linea_modi=traducir($codigo);

        print "$linea_modi"
  }else{
 my $linea_modi= traducir($line);
    print "$linea_modi";

  }

}
my $cont;
sub traducir {
    my ($linea) = @_;
    my $contenido = $linea;
    if ($contenido eq "") {
        return $linea;
    }
    if ($contenido !~ /[^\w\s]/) {
        $contenido = "<p>$contenido</p>";
    } else {

      $contenido =~ s/^# (.+)$/\<h1\>$1<\/h1\>/mg;
      $contenido =~ s/^## (.+)$/\<h2\>$1<\/h2\>/mg;
      $contenido =~ s/^###### (.+)$/\<h6\>$1<\/h6\>/mg;
      $contenido =~ s/\*\*(.+?)\*\*/\<p\><strong\>$1<\/strong><\/p\>/g;
      $contenido =~ s/(\*|_)(.+?)\1/<em>$2<\/em>/g;
      $contenido =~ s/~~(.+?)~~/<p><del>$1<\/del><\/p>/g;
      $contenido =~ s/```(.+?)```/<p><code>$1<\/code><\/p>/gs;
      $contenido =~ s/\[([^\[]+?)\]\(([^\)]+?)\)/\<a href="$2"\>$1<\/a\>/g;
    }
    return $contenido // $linea;
}
                             