#!"C:/xampp/perl/bin/perl.exe"
use strict;
use warnings;
use DBI;

print "Content-type: text/html\n\n";
print <<END_HTML;
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>WikiPweb</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
END_HTML

print <<END_HTML;
<a  id="btn-agg" href='agregar.pl'><button >Agregar Nuevo</button></a>
END_HTML

my $database = "wikipweb1";
my $host     = "127.0.0.1";
my $port     = 3306;
my $user     = "root";
my $password = "";

my $dsn = "DBI:mysql:database=$database;host=$host;port=$port";

my $dbh = DBI->connect($dsn, $user, $password, { PrintError => 0, RaiseError => 1 });

if ($dbh) {
    # consultas a  la tabla wiki de bd
    my $sql = "SELECT id, titulo FROM wiki";
    my $sth = $dbh->prepare($sql);
    $sth->execute();

    print "<table>\n";
    print "  <tr>\n";
    print "    <th>ID</th>\n";
    print "    <th>Título</th>\n";
    print "    <th>Acciones</th>\n";
    print "  </tr>\n";
    binmode(STDOUT, ":utf8");
    while (my $row = $sth->fetchrow_hashref) {
        print "  <tr>\n";
        print "    <td>$row->{id}</td>\n";
        print "    <td>$row->{titulo}</td>\n";
        print "    <td class='actions'>\n";
        print "      <a href='ver.pl?id=$row->{id}'>V</a>\n";
        print "      <a href='editar.pl?id=$row->{id}'>E</a>\n";
        print "      <a href='eliminar.pl?id=$row->{id}'>X</a>\n";
        print "    </td>\n";
        print "  </tr>\n";
    }

    print "</table>\n";

    $sth->finish();
    $dbh->disconnect();
} else {
    die "Error al conectar a la base de datos: " . DBI->errstr;
}

print <<END_HTML;
</body>
</html>
END_HTML
