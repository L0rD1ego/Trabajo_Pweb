#!"C:/xampp/perl/bin/perl.exe"
use strict;
use warnings;
use DBI;
use CGI;

my $cgi = CGI->new;

my $id = $cgi->param('id');

if (!$id) {
    print $cgi->redirect('conexion.pl');
    exit;
}

my $database = "wikipweb1";
my $host     = "127.0.0.1";
my $port     = 3306;
my $user     = "root";
my $password = "";

my $dsn = "DBI:mysql:database=$database;host=$host;port=$port";

my $dbh = DBI->connect($dsn, $user, $password, { PrintError => 0, RaiseError => 1 });

if ($dbh) {
    my $sql = "DELETE FROM wiki WHERE id = ?";
    my $sth = $dbh->prepare($sql);
    $sth->execute($id);

    $sth->finish();
    $dbh->disconnect();

    print $cgi->redirect('conexion.pl');
} else {
    die "Error al conectar a la base de datos: " . DBI->errstr;
}
