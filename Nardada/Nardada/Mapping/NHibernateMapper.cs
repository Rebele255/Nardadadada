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

        //private void MapCar()
        //{
        //    _modelMapper.Class<Car>(e =>
        //    {
        //        e.Id(p => p.RegNr);
        //        e.Property(p => p.Maker);
        //        e.Property(p => p.NrOfSeats);
        //        e.Property(p => p.Color);

        //        // Många bilar  hör till en kund
        //        e.ManyToOne(p => p.Owner, mapper =>
        //        {
        //            mapper.Column("OwnerGuid"); // Ange namn på kolumnen som pekar på pappan
        //            // Valfritt om du sätter "NotNullable(true)" eller "NotNullable(false)". (false är default). 
        //            // false = BlogPostId kan vara null
        //            // true =  BlogPostId får inte vara null
        //            //mapper.NotNullable(true);

        //            // Sätt Cascade.None här vid ManyToOne. (annars tas bloggposten bort när vi tar bort en kommentar = inte bra)
        //            mapper.Cascade(Cascade.None); // None är default
        //        });
        //    });
        //}

        private void MapQuestionCard()
        {
            _modelMapper.Class<QuestionCard>(e =>
            {
                e.Id(p => p.Id, p => p.Generator(Generators.GuidComb));
                e.Property(p => p.Question);
                e.Property(p => p.Year);

                //e.Set(x => x.Substantives, collectionMapping =>
                //{
                //    // Inverse true måste vara på ena sidan (men inte den andra). Det spelar ingen roll vilken sida du väljer.
                //    collectionMapping.Table("SubstantivTheme");
                //    collectionMapping.Cascade(Cascade.None);
                //    collectionMapping.Key(keyMap => keyMap.Column("ThemeId"));
                //}, map => map.ManyToMany(p => p.Column("SubstantivId")));

                //e.Set(x => x.Adjectives, collectionMapping =>
                //{
                //    // Inverse true måste vara på ena sidan (men inte den andra). Det spelar ingen roll vilken sida du väljer.
                //    collectionMapping.Table("AdjektivTheme");
                //    collectionMapping.Cascade(Cascade.None);
                //    collectionMapping.Key(keyMap => keyMap.Column("ThemeId"));
                //}, map => map.ManyToMany(p => p.Column("AdjektivId")));
            });
        }

        private void MapCategory()
        {
            _modelMapper.Class<Category>(e =>
            {
                // Låt varje tabell ha en "uniqueidentifier" med namn "Id" och är "primary key". Förutom kopplingstabeller.
                e.Id(p => p.Id, p => p.Generator(Generators.GuidComb));

                // Koppla ihop dina klassers fält med kolumnerna i databastabellen
                e.Property(p => p.Name); // property = vanlig kolumn
                                         //e.Property(p => p.Updated, m => m.Column("Uppdaterad")); // Exempel när en kolumn i en tabell heter "Uppdaterad" (och kopplas till "Updated")


                e.Set(p => p.Questions, p =>
                {
                    p.Inverse(true);
                    p.Cascade(Cascade.All);
                    p.Key(k => k.Column(col => col.Name("QuestionCategory")));
                }, p => p.OneToMany());

                //// Många-till-många-relation mellan BlogPost och Tag. (Det behövs en ManyToMany på andra sidan också)
                //e.Set(x => x.Questions, collectionMapping =>
                //{
                //    collectionMapping.Table("AdjektivTheme"); //namn på mellanliggande tabell
                //    collectionMapping.Inverse(true); //får bara finnas på ena!! 
                //    collectionMapping.Cascade(Cascade.None); // Sätt alltid "Cascade.None" vid en många-till-många-relation
                //    collectionMapping.Key(keyMap => keyMap.Column("AdjektivId")); // kopplingstabell (mellanliggande)
                //}, map => map.ManyToMany(p => p.Column("ThemeId"))); //kopplingstabellen (mellanliggande)
            });

        }
        //private void MapSubstantiv()
        //{
        //    _modelMapper.Class<Substantiv>(e =>
        //    {
        //        // Låt varje tabell ha en "uniqueidentifier" med namn "Id" och är "primary key". Förutom kopplingstabeller.
        //        e.Id(p => p.Id, p => p.Generator(Generators.GuidComb));

        //        // Koppla ihop dina klassers fält med kolumnerna i databastabellen
        //        e.Property(p => p.Word); // property = vanlig kolumn
        //                                 //e.Property(p => p.Updated, m => m.Column("Uppdaterad")); // Exempel när en kolumn i en tabell heter "Uppdaterad" (och kopplas till "Updated")


        //        // Många-till-många-relation mellan BlogPost och Tag. (Det behövs en ManyToMany på andra sidan också)
        //        e.Set(x => x.Themes, collectionMapping =>
        //        {
        //            collectionMapping.Table("SubstantivTheme"); //namn på mellanliggande tabell
        //            collectionMapping.Inverse(true); //får bara finnas på ena!! 
        //            collectionMapping.Cascade(Cascade.None); // Sätt alltid "Cascade.None" vid en många-till-många-relation
        //            collectionMapping.Key(keyMap => keyMap.Column("SubstantivId")); // kopplingstabell (mellanliggande)
        //        }, map => map.ManyToMany(p => p.Column("ThemeId"))); //kopplingstabellen (mellanliggande)
        //    });

        //}
    }
}


