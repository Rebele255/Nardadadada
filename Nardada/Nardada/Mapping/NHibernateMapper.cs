using NHibernate.Cfg.MappingSchema;
using NHibernate.Mapping.ByCode;
using Nardada.Domain;

namespace Nardada.Mapping
{
    public class NHibernateMapper
    {
        private readonly ModelMapper _modelMapper;

        public NHibernateMapper()
        {
            _modelMapper = new ModelMapper();
        }

        public HbmMapping Map()
        {
            MapQuestionCard();
            MapCategory();
            return _modelMapper.CompileMappingForAllExplicitlyAddedEntities();
        }

        private void MapQuestionCard()
        {
            _modelMapper.Class<QuestionCard>(e =>
            {
                e.Id(p => p.Id, p => p.Generator(Generators.GuidComb));
                e.Property(p => p.Question);
                e.Property(p => p.Year);

                e.ManyToOne(p => p.Category, mapper =>
                {
                    mapper.Column("CategoryId");
                    mapper.NotNullable(true);
                    mapper.Cascade(Cascade.None);
                });
            });
        }

        private void MapCategory()
        {
            _modelMapper.Class<Category>(e =>
            {
                e.Id(p => p.Id, p => p.Generator(Generators.GuidComb));
                e.Property(p => p.Name);
                e.Property(p => p.Color);

                e.Set(p => p.Questions, p =>
                {
                    p.Inverse(true);
                    p.Cascade(Cascade.All);
                    p.Key(k => k.Column(col => col.Name("CategoryId")));
                }, p => p.OneToMany());
            });

        }
    }
}


