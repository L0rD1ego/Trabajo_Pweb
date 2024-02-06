#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use utf8;
use DBI;

# Crear objeto CGI
my $cgi = CGI->new;

# Obtener parámetros del formulario
my $usuario = $cgi->param('usuario');
my $title = $cgi->param('titulo');

# Imprimir encabezado HTTP
print $cgi->header('text/html');

if (defined $usuario && defined $title) {
    my $user = 'alumno';
    my $password = 'pweb1';
    my $dsn = 'DBI:MariaDB:database=pweb1;host=192.168.1.13';

    my $dbh = DBI->connect($dsn, $user, $password, { RaiseError => 1, PrintError => 0, AutoCommit => 1 })
        or die ("No se puede conectar a la base de datos: $DBI::errstr");

    my $sql = "SELECT text FROM Articles WHERE owner=? AND title=?";
    my $sth = $dbh->prepare($sql);
    $sth->execute($usuario, $title);
    while (my ($text) = $sth->fetchrow_array) {
      my @lines = split /\n/, $text;
      my $line_count = scalar @lines;

      for (my $i = 0; $i < $line_count; $i++) {
          my $line = $lines[$i];
          if ($line =~ /```/) {
            my $codigo = "```";
            while ($i < $line_count - 1 && $lines[$i + 1] !~ /```/) {
                $i++;
                $codigo .= $lines[$i] . "<br></br>";
            }
            $codigo .= "```";
            my $linea_modi = traducir($codigo);
            print "$linea_modi";
          } else {
              my $linea_modi = traducir($line);
              print "$linea_modi";
          }
      }
    }
    $sth->finish;
    $dbh->disconnect;
   }
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

