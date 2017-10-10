using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Nardada.Domain
{
    public class Category
    {
        public virtual Guid Id { get; set; }
        public virtual string Name { get; set; }
        public virtual ICollection<QuestionCard> Questions { get; set; }

        public Category()
        {
            Questions = new List<QuestionCard>();
        }
    }
}