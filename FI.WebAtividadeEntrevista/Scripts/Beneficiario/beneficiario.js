var $beneficiarios = [];
var indiceBeneficiarioEditando = null;

$(function () {
    if (modelBeneficiarios) {
        $beneficiarios = modelBeneficiarios;
        gerarTabelaBeneficiarios();
    }

    $('#CPFBeneficiario').mask('000.000.000-00', { reverse: true });
    var $cpfBeneficiario = $('#CPFBeneficiario');
    var $modalBeneficiario = $("#modalBeneficiario");
    var $nomeBeneficiario = $('#NOMEBeneficiario');
    var $btnConfirmarAlteracaoBeneficiario = $("#btnCadastrarBeneficiario");
    var $hiddenCodigoEditarBeneficiario = $("#hiddenCodigoEditarBeneficiario");

    function limparModalBeneficiarios() {
        $cpfBeneficiario.val("");
        $nomeBeneficiario.val("");
        $hiddenCodigoEditarBeneficiario.val("");
    }

    function habilitaCadastroBeneficiario() {
        limparModalBeneficiarios();

        $btnConfirmarAlteracaoBeneficiario.text("Cadastrar")
        $btnConfirmarAlteracaoBeneficiario.removeClass('js-editando-beneficiario');
        $btnConfirmarAlteracaoBeneficiario.addClass('js-cadastrar-beneficiario');

        gerarTabelaBeneficiarios();
    }

    function habilitaEdicaoBeneficiario(codigo, cpf, nome) {
        $btnConfirmarAlteracaoBeneficiario.removeClass('js-cadastrar-beneficiario');
        $btnConfirmarAlteracaoBeneficiario.addClass('js-editando-beneficiario');

        $btnConfirmarAlteracaoBeneficiario.text("Editar")

        $cpfBeneficiario.val(cpf);
        $nomeBeneficiario.val(nome);

        $hiddenCodigoEditarBeneficiario.val(codigo);
    }

    $(document).on('click', '.js-incluir-beneficiarios', function () {
        $modalBeneficiario.modal();

        habilitaCadastroBeneficiario();
    });

    $(document).on('click', '.js-editar-beneficiario', function () {
        let codigo = $(this).data('codigo');
        let cpf = $(this).data('cpf');
        let nome = $(this).data('nome');

        indiceBeneficiarioEditando = $(this).data('codigo');

        $('tr').show();

        habilitaEdicaoBeneficiario(codigo, cpf, nome)

        $(`tr[data-codigo="${codigo}"]`).hide();
    });

    $(document).on(`click`, '.js-cadastrar-beneficiario', function (e) {
        e.preventDefault();

        var objeto = {
            CPFBeneficiario: $cpfBeneficiario.val(),
            NOME: $nomeBeneficiario.val()
        };

        if (camposValidos()) {
            $beneficiarios.push(objeto);
            gerarTabelaBeneficiarios();
            habilitaCadastroBeneficiario();
            indiceBeneficiarioEditando = null;
        }
    });

    const camposValidos = function () {
        var objeto = {
            CPFBeneficiario: $cpfBeneficiario.val(),
            NOME: $nomeBeneficiario.val()
        };

        let jaExiste = false;

        if (indiceBeneficiarioEditando === null) {            

            let beneficiarioIgual = $beneficiarios.filter(c => c.CPFBeneficiario === objeto.CPFBeneficiario);

            if (beneficiarioIgual.length > 0) {                
                jaExiste = true;
            }
        }
        else {            
            var objetoIgual = $beneficiarios.filter(c => c.CPFBeneficiario === objeto.CPFBeneficiario);

            if (objetoIgual.length > 0) {
                let indiceDoCpfIgual = $beneficiarios.findIndex(c => c.CPFBeneficiario === objetoIgual[0].CPFBeneficiario)

                if (indiceDoCpfIgual !== indiceBeneficiarioEditando) {
                    jaExiste = true;
                }
            }
        }
       
        if (jaExiste) {
            MensagemErroPersonalizada('Já existe um beneficiário com esses dados');
        }
        else if (!validaCPF($('#CPFBeneficiario').val())) {
            MensagemErroPersonalizada('Por favor digite um CPF válido');
            $('#CPFBeneficiario').focus();
        }
        else if ($('#NOMEBeneficiario').val().length === 0) {
            MensagemErroPersonalizada('Por favor digite um nome');
            $('#NOMEBeneficiario').focus();
        }
        else {
            return true;
        }

        return false;
    }

    $(document).on('click', '.js-editando-beneficiario', function (e) {
        e.preventDefault();

        if (camposValidos()) {
            beneficiarioEditado = $beneficiarios[indiceBeneficiarioEditando];

            beneficiarioEditado.NOME = $nomeBeneficiario.val();
            beneficiarioEditado.CPFBeneficiario = $cpfBeneficiario.val();

            $('.js-tabela-beneficiarios').find('tbody').html('');

            habilitaCadastroBeneficiario();
        }
    });

    $(document).on('click', '.js-excluir-beneficiario', function () {
        let indice = $(this).data('codigo');

        $beneficiarios.splice(indice, 1);

        gerarTabelaBeneficiarios();
    });

    $(document).on('click', '#btnCancelarBeneficiario', function (e) {
        e.preventDefault();

        if ($btnConfirmarAlteracaoBeneficiario.hasClass('js-editando-beneficiario')) {
            habilitaCadastroBeneficiario();
        } else {
            $('#modalBeneficiario').modal('hide');
        }
    });

});

function gerarTabelaBeneficiarios() {
    var $tabelaBeneficiario = $(".js-tabela-beneficiarios")
    var $bodyTabelaBeneficiario = $tabelaBeneficiario.find("tbody");

    $bodyTabelaBeneficiario.children().remove()

    for (var i = 0; i < $beneficiarios.length; i++) {
        var beneficiario = $beneficiarios[i];
        $bodyTabelaBeneficiario.append(`   
                            <tr data-codigo="${i}">
                                <td class='td-cpf-beneficiario'>${beneficiario.CPFBeneficiario}</td> 
                                <td class='td-nome-beneficiario'>${beneficiario.NOME}</td>  
                                <td class="">
                                    <a class="glyphicon glyphicon-pencil js-editar-beneficiario" data-cpf="${beneficiario.CPFBeneficiario}" data-nome="${beneficiario.NOME}" data-codigo="${i}" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Editar"></a>
                                    <a class="glyphicon glyphicon-remove js-excluir-beneficiario" data-codigo="${i}" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Excluir"></a>
                                </td>
                            </tr>`);
    }
}