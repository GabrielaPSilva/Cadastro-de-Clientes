function esconderAlerts() {
    setTimeout(function () {
        $(".alert").fadeOut("slow")
    }, 5000)
}

function mostrarMensagem(n, t, i, r) {
    $("#alert-helper").html("<div style='display:none;' class='alert alert-" + r + " alert-dismissable erro-dashboard' style='z-index:9999999999;'><i class='fa fa-" + i + "'><\/i><button aria-hidden='true' data-dismiss='alert' class='close' type='button'>×<\/button>" + n + "<\/div>");
    $("#alert-helper .alert").fadeIn("slow");
    esconderAlerts()
}

function MensagemErroPersonalizada(n, t) {
    mostrarMensagem(n, t, "ban", "danger")
}

function MensagemErro(n) {
    mostrarMensagem("Ops! Ocorreu um erro.", n, "ban", "danger")
}

function MensagemSucesso(n, t) {
    mostrarMensagem(n, t, "check", "success")
}

const validaCPF = function (cpf) {
    cpf = cpf.replace('.', '');
    cpf = cpf.replace('.', '');
    cpf = cpf.replace('-', '');

    erro = new String;
    if (cpf.length < 11) erro += "Sao necessarios 11 digitos para verificacao do CPF! \n\n";
    var nonNumbers = /\D/;
    if (nonNumbers.test(cpf)) erro += "A verificacao de CPF suporta apenas numeros! \n\n";
    if (cpf == "00000000000" || cpf == "11111111111" ||
        cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" ||
        cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" ||
        cpf == "88888888888" || cpf == "99999999999") {
        erro += "Numero de CPF invalido!"
    }
    var a = [];
    var b = new Number;
    var c = 11;
    for (i = 0; i < 11; i++) {
        a[i] = cpf.charAt(i);
        if (i < 9) b += (a[i] * --c);
    }
    if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11 - x }
    b = 0;
    c = 11;
    for (y = 0; y < 10; y++) b += (a[y] * c--);
    if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11 - x; }
    status = a[9] + "" + a[10]
    if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10])) {
        erro += "Digito verificador com problema!";
    }
    if (erro.length > 0) {
        return false;
    }
    return true;
}