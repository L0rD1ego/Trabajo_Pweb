#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use DBI;


my $cgi=CGI->new;
print $cgi->header('text/html;charset=UTF-8');
print <<XML;
<?xml version='1.0' encoding='utf-8'?>
XML

my $usuario = $cgi->param('user');
my $contrasena = $cgi->param('password');
my $lastName = $cgi->param('lastName');
my $firstName =$cgi->param('firstName');

if (defined $usuario and defined $contrasena and defined $lastName and defined $firstName) {
  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = 'DBI:MariaDB:database=pweb1;host=192.168.1.13';
  my $dbh = DBI->connect($dsn, $user, $password)or die ("No se puede conectar!");
  #{RaiseError => 1, PrintError => 0, AutoCommit => 1});
  my $check_sql= "SELECT * FROM Users Where userName=?";
  my $check_sth =$dbh->prepare($check_sql);
  $check_sth->execute($usuario);
if ($check_sth->fetchrow_array) {
    print "Usuario ya existe";
    print <<XML;
  <user>
  </user>
XML
}  else {
    print "Insertando nuevo usuario";
    my $sql = "INSERT INTO Users VALUES(?,?,?,?)";
    my $sth = $dbh->prepare($sql);
    $sth->execute($usuario, $contrasena, $lastName, $firstName);
    $sth->finish;
    $dbh->disconnect;
    successLogin($usuario, $firstName, $lastName);
}
}else{
  print <<XML;
  <user>
  </user>
XML

}

sub successLogin{
  my ($owner, $firstName, $lastName) = @_;
  print <<XML;
  <user>
    <owner>$owner</owner>
    <firstName>$firstName</firstName>
    <lastName>$lastName</lastName>
  </user>
XML
}

