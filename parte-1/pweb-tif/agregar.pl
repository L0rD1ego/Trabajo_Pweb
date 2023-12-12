#!"C:/xampp/perl/bin/perl.exe"
use strict;
use warnings;
use DBI;
use CGI;
use DateTime;

my $cgi = CGI->new;

print "Content-type: text/html\n\n";
print <<END_HTML;
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>WikiPweb - Agregar cont</title>
    <link rel="stylesheet" href="./css/Agregar.css">
</head>
<body>
END_HTML

if ($cgi->param) {
    my $titulo    = $cgi->param('titulo');
    my $contenido = $cgi->param('contenido');

    my $fecha = DateTime->now->ymd;

    my $database = "wikipweb1";
    my $host     = "127.0.0.1";
    my $port     = 3306;
    my $user     = "root";
    my $password = "";

    my $dsn = "DBI:mysql:database=$database;host=$host;port=$port";

    my $dbh = DBI->connect($dsn, $user, $password, { PrintError => 0, RaiseError => 1 });

    if ($dbh) {
        my $sql = "INSERT INTO wiki (fecha, titulo, contenido) VALUES (?, ?, ?)";
        my $sth = $dbh->prepare($sql);
        $sth->execute($fecha, $titulo, $contenido);

        $sth->finish();
        $dbh->disconnect();

        print <<END_HTML;
        <script>
            setTimeout(function() {
                window.location.href = 'conexion.pl';
            }, 2000);  // Redirige después de 2 segundos (puedes ajustar este valor)
        </script>
END_HTML
    } else {
        die "Error al conectar a la base de datos: " . DBI->errstr;
    }
}

print <<END_HTML;
<h2>Agregar Nuevo</h2>
<form method="post">
    <label for="titulo">Título:</label>
    <input type="text" id="titulo" name="titulo" required><br>

    <label for="contenido">Contenido:</label>
    <textarea id="contenido" name="contenido" rows="4" required></textarea><br>

    <input type="submit" value="Guardar">
</form>
<a href='conexion.pl'><button id="cancel">Cancelar</button></a>
END_HTML

print <<END_HTML;
</body>
</html>
END_HTML
