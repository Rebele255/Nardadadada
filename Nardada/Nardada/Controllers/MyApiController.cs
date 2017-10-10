using Nardada.Domain;
using Nardada.Services;
using NHibernate.Linq;
using NHibernate.Tool.hbm2ddl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Nardada.Controllers
{

    [RoutePrefix("api")]
    public class MyApiController : ApiController
    {
        
        //Create new DB
        [Route("createdb"), HttpGet]
        public void CreateDB()
        {
            var cfg = DbService.Configure();
            var export = new SchemaExport(cfg);
            export.Create(true, true);
        }

        //Drop DB
        [Route("dropdb"), HttpGet]
        public void DropDB()
        {
            var cfg = DbService.Configure();
            var export = new SchemaExport(cfg);
            export.Drop(true, true);
        }

        [Route("getquestions"), HttpGet]
        public IHttpActionResult GetQuestionsFromDB()
        {
            var sesh = DbService.OpenSession();
            var questionList = sesh.Query<QuestionCard>();
            var rebecca = questionList.Select(x => new { x.Year, x.Question, x.Category.Name  }).ToList();
            DbService.CloseSession(sesh);

            return Ok(rebecca);
        }
    }
}