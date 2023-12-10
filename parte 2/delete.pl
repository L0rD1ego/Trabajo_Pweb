#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use utf8;
use DBI;

my $cgi  = CGI->new;
print $cgi->header('text/xml;charset=UTF-8');
print <<XML;
<?xml version='1.0' encoding='utf-8'?>
XML

my $usuario = $cgi->param('usuario');
my $title = $cgi->param('titulo');

if (defined $usuario && defined $title) {
    my $user= 'alumno';
    my $password = 'pweb1';
    my $dsn = 'DBI:MariaDB:database=pweb1;host=192.168.1.13';

    my $dbh = DBI->connect($dsn, $user, $password, {RaiseError => 1, PrintError => 0, AutoCommit => 1})
        or die ("No se puede conectar a la base de datos: $DBI::errstr");

    my $sql = "DELETE FROM Articles WHERE owner=? AND title=?";
    my $sth = $dbh->prepare($sql);
    $sth->execute($usuario, $title);
    print <<XML;
<article>
XML

    if ($sth->rows > 0) {
        # Éxito: Se eliminó el artículo
        print <<XML;
    <owner>$usuario</owner>
    <title>$title</title>
XML
    }

    $sth->finish;
    $dbh->disconnect;
    
}

print <<XML;
</article>
XML

