using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        public bool Cadastrar(List<Beneficiario> beneficiarios, bool atualizar, long idCliente)
        {
            try
            {
                DAL.DaoBeneficiario beneficiarioDAL = new DAL.DaoBeneficiario();

                if (atualizar)
                    beneficiarioDAL.DeletarBeneficiarios(idCliente);

                foreach (var beneficiario in beneficiarios)
                {
                    beneficiarioDAL.Cadastrar(beneficiario);
                }

                return true;
            }
            catch (Exception e)
            {
                return false;
            }

        }

        public List<Beneficiario> Listar(long id)
        {
            DAL.DaoBeneficiario beneficiarioDAL = new DAL.DaoBeneficiario();

            var teste = beneficiarioDAL.ConsultarBeneficiarios(id);

            return teste;
        }
    }
}
