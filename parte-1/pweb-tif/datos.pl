#!"C:/xampp/perl/bin/perl.exe"
use strict;
use warnings;
use DBI;

# Incluye el archivo de conexión
require "conexion.pl";

# Realiza una consulta para obtener los datos de la tabla "wiki"
my $sql = "SELECT * FROM wiki";
my $sth = $dbh->prepare($sql);
$sth->execute();

# Imprime los resultados
print "Content-type: text/html\n\n";
while (my $row = $sth->fetchrow_hashref) {
    print "ID: $row->{id}<br>";
    print "Fecha: $row->{fecha}<br>";
    print "Título: $row->{titulo}<br>";
    print "Contenido: $row->{contenido}<br><br>";
}

# Cierra la conexión y la consulta
$sth->finish();
$dbh->disconnect();
