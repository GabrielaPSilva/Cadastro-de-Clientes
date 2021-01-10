
$(document).ready(function () {
    $("#CEP").mask('00000-000');
    $("#Telefone").mask('(00) 0000-0000');
    $("#CPF").mask('000.000.000-00', { reverse: true });

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        if (camposValidos()) {
            var modelCliente =
            {
                "NOME": $("#Nome").val(),
                "CEP": $("#CEP").val(),
                "Email": $("#Email").val(),
                "Sobrenome": $("#Sobrenome").val(),
                "Nacionalidade": $("#Nacionalidade").val(),
                "Estado": $("#Estado").val(),
                "Cidade": $("#Cidade").val(),
                "Logradouro": $("#Logradouro").val(),
                "Telefone": $("#Telefone").val(),
                "CPF": $('#CPF').val(),
                "Beneficiarios": $beneficiarios
            };

            $.ajax({
                url: urlPost,
                method: "POST",
                data: modelCliente,
                error:
                    function (r) {
                        if (r.status == 400)
                            ModalDialog("Ocorreu um erro", r.responseJSON);
                        else if (r.status == 500)
                            ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                    },
                success:
                    function (r) {
                        ModalDialog("Sucesso!", r)

                        if (tipoOperacao == "incluir") {
                            $('#formCadastro')[0].reset();
                            $beneficiarios = [];
                            indiceBeneficiarioEditando = null;
                            $('.js-tabela-beneficiarios tbody').html('');
                        }
                    }
            });
        }
    })

    $('#CEP').on('blur', function () {
        let cep = $(this).val();
        if (cep.replace("-", "").length === 8) {
            $.get(`https://viacep.com.br/ws/${cep}/json/`, {}, function (response) {
                $('#Logradouro').val(response.logradouro);
                $('#Cidade').val(response.localidade);                
            })
        }
    });

    const camposValidos = function () {
        if (!validaCPF($('#CPF').val())) {
            MensagemErroPersonalizada('Por favor digite um CPF válido');
        }  
        else {
            return true;
        }

        return false
    }
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

