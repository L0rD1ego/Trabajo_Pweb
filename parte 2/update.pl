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

my $owner = $cgi->param('usuario');
my $title = $cgi->param('titulo');
my $text  = $cgi->param('texto');

if (defined $title and defined $text and defined $owner) {
    my $user = 'alumno';
    my $password = 'pweb1';
    my $dsn   = 'DBI:MariaDB:database=pweb1;host=192.168.1.13';

    my $dbh = DBI->connect($dsn, $user, $password, {RaiseError => 1, PrintError => 0, AutoCommit => 1})
        or die ("No se puede conectar a la base de datos: $DBI::errstr");

    my $sql = "UPDATE Articles SET text=? WHERE title=? AND owner=?";
    my $sth = $dbh->prepare($sql);
    $sth->execute($text, $title, $owner);
    print <<XML;
<article>
XML

    if ($sth->rows > 0) {# Verificar si se modifico a mas de una linea
        print <<XML;
    <title>$title</title>
    <text>$text</text>
XML
}

    $sth->finish;
    $dbh->disconnect;
}

print <<XML;
</article>
XML

