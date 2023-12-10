#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use DBI;


my $cgi = CGI->new;
print $cgi->header('text/xml,charset=UTF-8');
print <<XML;
<?xml version='1.0' encoding='utf-8'?>
XML

my $user = $cgi->param('user');
my $password = $cgi->param('password');

if(defined($user) and defined($password)){
  if (my @userInfo = checkLogin($user, $password)) {
        my ($owner,$passwrd, $lastName, $firstName) = @userInfo;
        successLogin($owner, $firstName, $lastName);
  } else {
     print <<XML;
<user>
</user>
XML

  }
}else{
  print <<XML;
<user>
</user>
XML

}

sub checkLogin{
  my $userQuery = $_[0];
  my $passwordQuery = $_[1];

  my $user = 'alumno';
  my $password = 'pweb1';
  my $dsn = 'DBI:MariaDB:database=pweb1;host=192.168.1.13';
  my $dbh = DBI->connect($dsn, $user, $password)or die ("No se puede conectar!");
  #{RaiseError => 1, PrintError => 0, AutoCommit => 1});

  my $sql = "SELECT * FROM Users WHERE userName=? AND password=?";
  my $sth = $dbh->prepare($sql);
  $sth->execute($userQuery, $passwordQuery);
  my @row = $sth->fetchrow_array;
  $sth->finish;
  $dbh->disconnect;
  return @row;
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
         