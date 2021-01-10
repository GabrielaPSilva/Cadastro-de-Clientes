using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAtividadeEntrevista.Models
{
    public class BeneficiarioModel
    {
        public long ID { get; set; }

        /// <summary>
        /// CPF
        /// </summary>
        [Required]
        public string CPFBeneficiario { get; set; }

        /// <summary>
        /// NOME
        /// </summary>
        [Required]
        public string NOME { get; set; }

        /// <summary>
        /// IDCLIENTE
        /// </summary>
        public long IDCLIENTE { get; set; }
        
    }
}