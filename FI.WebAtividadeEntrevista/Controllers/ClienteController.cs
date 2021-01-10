﻿using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using System.Web.Http.Results;
using System.Web.UI.WebControls;
using System.Net;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Incluir()
        {
            return View(new ClienteModel());
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario boBeneficiario = new BoBeneficiario();

            if (!ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                var clienteExistente = bo.Consultar(model.CPF);

                if (clienteExistente != null)
                {
                    Response.StatusCode = 400;
                    return Json("CPF Já existente na base de dados");
                }

                model.Id = bo.Incluir(new Cliente()
                {
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF

                });

                if (model.Id > 0 && model.Beneficiarios != null && model.Beneficiarios.Any())
                {
                    boBeneficiario.Cadastrar(model.Beneficiarios.Select(c => new Beneficiario()
                    {
                        CPF = c.CPFBeneficiario,
                        ID = c.ID,
                        IDCLIENTE = model.Id,
                        NOME = c.NOME
                    }).ToList(), atualizar: false, idCliente: model.Id);
                }

                return Json("Cadastro efetuado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario boBeneficiario = new BoBeneficiario();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                var cpfExistente = bo.Consultar(model.CPF);

                if (cpfExistente != null && cpfExistente.Id != model.Id)
                {
                    Response.StatusCode = 400;
                    return Json("CPF Já existente na base de dados");
                }

                bo.Alterar(new Cliente()
                {
                    Id = model.Id,
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                });

                if (model.Id > 0)
                {
                    model.Beneficiarios = model.Beneficiarios ?? new List<BeneficiarioModel>();

                    boBeneficiario.Cadastrar(model.Beneficiarios.Select(c => new Beneficiario()
                    {
                        CPF = c.CPFBeneficiario,
                        ID = c.ID,
                        IDCLIENTE = model.Id,
                        NOME = c.NOME
                    }).ToList(), atualizar: true, idCliente: model.Id);
                }

                ModelState.Clear();

                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario boBeneficiario = new BoBeneficiario();

            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = cliente.CPF
                };

                var beneficiarios = boBeneficiario.Listar(model.Id);

                model.Beneficiarios = beneficiarios.Select(c => new BeneficiarioModel()
                {
                    CPFBeneficiario = c.CPF,
                    ID = c.ID,
                    IDCLIENTE = c.IDCLIENTE,
                    NOME = c.NOME
                }).ToList();

                return View(model);
            }
            else
            {
                return RedirectToAction("Incluir");
            }
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }
    }
}