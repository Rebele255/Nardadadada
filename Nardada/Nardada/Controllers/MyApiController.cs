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

        [Route("getquestions"), HttpGet]
        public IHttpActionResult GetQuestionsFromDB()
        {
            var sesh = DbService.OpenSession();
            var questionList = new List<QuestionCard>();
            questionList = sesh.Query<QuestionCard>().ToList();
            DbService.CloseSession(sesh);

            var hej = questionList[0].Year;

            return Ok(questionList[0]);
        }
    }
}