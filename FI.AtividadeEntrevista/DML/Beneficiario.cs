using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.DML
{
    public class Beneficiario
    {
        public long ID { get; set; }

        /// <summary>
        /// CPF
        /// </summary>
        public string CPF { get; set; }

        /// <summary>
        /// NOME
        /// </summary>
        public string NOME { get; set; }

        /// <summary>
        /// IDCLIENTE
        /// </summary>
        public long IDCLIENTE { get; set; }
    }
}
