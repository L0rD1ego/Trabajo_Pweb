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
    <title>WikiPweb - Ver</title>
    <link rel="stylesheet" href="./css/Ver.css">
</head>
<body>
END_HTML

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

        if ($row) {
    my @lineas = split /\n/, $row->{contenido};

    my $codigo_bloque = 0;
    my $codigo_vacio  = 1;

    while (my $linea = shift @lineas) {
        $linea =~ s/^# (.+)$/<h1>$1<\/h1>/;
        $linea =~ s/^## (.+)$/<h2>$1<\/h2>/;
        $linea =~ s/^###### (.+)$/<h6>$1<\/h6>/;

        $linea =~ s/\*\*([^*]+)\*\*/<strong>$1<\/strong><br>/g;

        $linea =~ s/\*([^*]+)\*/<em>$1<\/em><br>/g;

        $linea =~ s/~~([^~]+)~~/<del>$1<\/del>br>/g;

        if ($linea =~ /^```$/) {
            $codigo_bloque = !$codigo_bloque;
            print "<p><code>\n" if $codigo_bloque;

            while ($linea = shift @lineas) {
                print "$linea\n";
            }

            $codigo_vacio = 0 if $codigo_bloque;
            print "</code></p>\n" if $codigo_bloque;
        } else {
            print "$linea\n";
        }
    }

    print "</code></p>\n" if $codigo_vacio && $codigo_bloque;
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
