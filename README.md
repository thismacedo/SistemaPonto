# 🕒 Sistema de Marcação de Ponto

Um sistema web para gerenciamento de registros de ponto de funcionários, com backend em C# ASP.NET Core, frontend em HTML/CSS/JavaScript e banco de dados SQL Server. O sistema permite que funcionários registrem entradas e saídas, enquanto administradores podem visualizar, exportar relatórios em Excel e integrar com ferramentas de visualização como Power BI.

---

## ✨ Funcionalidades

- **Autenticação Segura:** Login de usuários com email e senha, com distinção entre administradores e funcionários comuns.  
- **Registro de Ponto:** Funcionários podem registrar entrada e saída com data e hora automáticas.  
- **Painel Administrativo:** Visualização de todos os registros de ponto, com filtros por usuário e período.  
- **Exportação para Excel:** Geração de relatórios em formato `.xlsx` com dados de ponto.  
- **Integração com Power BI:** Suporte para exportação de dados para análise e visualização em dashboards.  
- **Logs de Ações:** Registro de atividades (ex.: logins, marcações) para auditoria.  

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura cliente-servidor com separação clara entre frontend, backend e banco de dados:

- **Frontend:** Interface web simples construída com HTML, CSS e JavaScript, servida como arquivos estáticos.  
- **Backend:** API RESTful desenvolvida em C# com ASP.NET Core, responsável por autenticação, gerenciamento de ponto e exportação de relatórios.  
- **Banco de Dados:** SQL Server, com tabelas para usuários, marcações de ponto e logs, gerenciadas via Entity Framework Core.  
- **Relatórios:** Integração com ClosedXML para exportação de relatórios em Excel e suporte a Power BI para visualizações.  

A comunicação entre frontend e backend ocorre via requisições HTTP (REST), com JSON como formato de dados.

---

## 🛠️ Tecnologias Utilizadas

### Backend:
- C# / .NET 9.0  
- ASP.NET Core (API REST)  
- Entity Framework Core (ORM)  
- ClosedXML (exportação para Excel)  

### Frontend:
- HTML5  
- CSS3  
- JavaScript (ES6)  

### Banco de Dados:
- SQL Server  

### Ferramentas:
- Git (controle de versão)  
- Power BI (visualização de dados, opcional)  

### Dependências:
- `Microsoft.EntityFrameworkCore.SqlServer`  
- `Microsoft.EntityFrameworkCore.Design`  
- `ClosedXML`  

---

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter:

- [.NET SDK 9.0](https://dotnet.microsoft.com/en-us/download) ou superior  
- SQL Server (Express ou superior) instalado  
- [Git](https://git-scm.com/) para clonar o repositório  
- (Opcional) [Power BI Desktop](https://powerbi.microsoft.com/pt-br/desktop/) para visualização de relatórios  
- Um editor de código, como [Visual Studio Code](https://code.visualstudio.com/) ou [Visual Studio 2022](https://visualstudio.microsoft.com/pt-br/)  

---

## 🚀 Em breve
Funcionalidades como edição de marcações, notificações e dashboard online no painel do admin estão previstas para futuras versões.
