

using FI.AtividadeEntrevista.DML;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace FI.AtividadeEntrevista.DAL
{
    internal class DaoBeneficiario : AcessoDados
    {
        internal long Cadastrar(DML.Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF));
            parametros.Add(new System.Data.SqlClient.SqlParameter("NOME", beneficiario.NOME));
            parametros.Add(new System.Data.SqlClient.SqlParameter("@IDCLIENTE", beneficiario.IDCLIENTE));

            DataSet ds = base.Consultar("FI_SP_IncBeneficiario", parametros);
            long ret = 0;
            if (ds.Tables[0].Rows.Count > 0)
                long.TryParse(ds.Tables[0].Rows[0][0].ToString(), out ret);
            return ret;
        }

        internal void DeletarBeneficiarios(long idCliente)
        {
            var parametros = new List<System.Data.SqlClient.SqlParameter>()
            {
                new System.Data.SqlClient.SqlParameter("@IDCLIENTE", idCliente)
            };

            Executar("FI_SP_DelBeneficiarios", parametros);
        }

        internal List<Beneficiario> ConsultarBeneficiarios(long idCliente)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("@IDCliente", idCliente));

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiario", parametros);
            List<DML.Beneficiario> beneficiarios = Converter(ds);

            return beneficiarios;

        }

        private List<DML.Beneficiario> Converter(DataSet ds)
        {
            List<DML.Beneficiario> lista = new List<DML.Beneficiario>();
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    DML.Beneficiario beneficiario = new DML.Beneficiario();
                    beneficiario.ID = row.Field<long>("ID");
                    beneficiario.NOME = row.Field<string>("NOME");
                    beneficiario.IDCLIENTE = row.Field<long>("IDCLIENTE");
                    beneficiario.CPF = row.Field<string>("CPF");
                    lista.Add(beneficiario);
                }
            }

            return lista;
        }
    }
}
