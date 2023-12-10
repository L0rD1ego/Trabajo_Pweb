#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use utf8;
use DBI;

my $cgi=CGI->new;
print $cgi->header('text/html;charset=UTF-8');
print <<XML;
<?xml version='1.0' encoding='utf-8'?>
XML
my $titulo=$cgi->param('titulo');
my $texto=$cgi->param('text_intro');
my $user=$cgi->param('usuario');


if (defined $user and defined $titulo and defined $texto) {
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = 'DBI:MariaDB:database=pweb1;host=192.168.1.13';
  my $dbh = DBI->connect($dsn, $user, $password)or die ("No se puede conectar!");
  #{RaiseError => 1, PrintError => 0, AutoCommit => 1});
my $check_sql= "SELECT * FROM Articles Where title=? AND owner=?";
  my $check_sth =$dbh->prepare($check_sql);
  $check_sth->execute($titulo,$user);
  if($check_sth -> fetchrow_array){
   print <<XML;
  <user>
  </user>
XML

  }else{
  my $sql = "INSERT INTO Articles VALUES(?,?,?)";
  my $sth = $dbh->prepare($sql);
  $sth->execute($titulo, $user, $texto);
  $sth->finish;
  $dbh->disconnect;
  successLogin($titulo, $user, $texto);
  }
  
}else{
  print <<XML;
  <user>
  </user>
XML

}

sub successLogin{
  my ($titulo, $user, $texto) = @_;
  print <<XML;
  <article>
    <title>$titulo</title>
    <text>$texto</text>
  </article>
XML
}

