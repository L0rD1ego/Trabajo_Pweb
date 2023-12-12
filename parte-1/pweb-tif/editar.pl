#!"C:/xampp/perl/bin/perl.exe"
use strict;
use warnings;
use DBI;
use CGI;

my $cgi = CGI->new;

print "Content-type: text/html\n\n";
print <<END_HTML;
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>WikiPweb - Edición</title>
    <link rel="stylesheet" href="./css/Agregar.css">
</head>
<body>
END_HTML

# Obtener el ID del parámetro de la URL
my $id = $cgi->param('id');

if ($id) {
    my $database = "wikipweb1";
    my $host     = "127.0.0.1";
    my $port     = 3306;
    my $user     = "root";
    my $password = "";

    my $dsn = "DBI:mysql:database=$database;host=$host;port=$port";

    my $dbh = DBI->connect($dsn, $user, $password, { PrintError => 0, RaiseError => 1 });

    if ($dbh) {
        my $sql = "SELECT titulo, contenido FROM wiki WHERE id = ?";
        my $sth = $dbh->prepare($sql);
        $sth->execute($id);

        my $row = $sth->fetchrow_hashref;

        if ($row && $cgi->param('guardar_edicion')) {
            my $nuevo_titulo    = $cgi->param('titulo');
            my $nuevo_contenido = $cgi->param('contenido');

            my $update_sql = "UPDATE wiki SET titulo = ?, contenido = ? WHERE id = ?";
            my $update_sth = $dbh->prepare($update_sql);
            $update_sth->execute($nuevo_titulo, $nuevo_contenido, $id);

            $update_sth->finish();

            print <<END_HTML;
            <script>
                window.location.href = 'conexion.pl';
            </script>
END_HTML
        }

        if ($row) {
            print <<END_HTML;
<h2>Edición del ID: $id</h2>
<form method="post">
    <input type="hidden" name="id" value="$id"> <!-- Campo oculto para el ID -->

    <label for="titulo">Título:</label>
    <input type="text" id="titulo" name="titulo" value="$row->{titulo}" required><br>

    <label for="contenido">Contenido:</label>
    <textarea id="contenido" name="contenido" rows="4" required>$row->{contenido}</textarea><br>

    <input type="submit" name="guardar_edicion" value="Guardar Edición">
</form>
<a href='conexion.pl'><button id="cancel">Cancelar / Regresar</button></a>
END_HTML
        } else {
            print "<p>No se encontró el registro con el ID: $id</p>";
        }

        $sth->finish();
        $dbh->disconnect();
    } else {
        die "Error al conectar a la base de datos: " . DBI->errstr;
    }
} else {
    print "<p>ID no proporcionado.</p>";
}

print <<END_HTML;
</body>
</html>
END_HTML
