#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use utf8;
use DBI;

my $cgi=CGI->new;
print $cgi->header('text/xml;charset=UTF-8');
print <<XML;
<?xml version='1.0' encoding='utf-8'?>
XML
my $usuario=$cgi->param('usuario');


if (defined $usuario) {
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = 'DBI:MariaDB:database=pweb1;host=192.168.1.13';
  my $dbh = DBI->connect($dsn, $user, $password, { RaiseError => 1, PrintError => 0, AutoCommit => 1, HandleError => sub { } }) or die ("No se puede conectar a la base de datos: $DBI::errstr");
 ##)or die ("No se puede conectar!");
  #{RaiseError => 1, PrintError => 0, AutoCommit => 1});
  my $sql= "SELECT  owner, title  FROM Articles Where owner=?";
  my $sth =$dbh->prepare($sql);
  $sth->execute($usuario);
  print <<XML;
<articles>
XML

  while( my ($owner , $title)=$sth-> fetchrow_array){
    print <<XML;
      <article>
         <owner>$owner</owner>
         <title>$title</title>
    </article>
XML
 }
  $sth->finish;
  $dbh->disconnect;
  print <<XML;
</articles>
XML

}else{
  print <<XML;
<articles>
</articles>
XML
}
