using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Nardada.Domain
{
    public class QuestionCard
    {
        public virtual Guid Id { get; set; }
        public virtual string Question { get; set; }
        public virtual int Year { get; set; }
        public virtual Category QuestionCategory { get; set; }

    }
}