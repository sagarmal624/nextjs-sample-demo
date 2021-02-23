import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import sanity from "../lib/sanity";
import listStyles from "../styles/list";
import imageUrlFor from "../utils/imageUrlFor";

var azure = require('azure-storage');
const query = `*[_type == "person"] {
  _id,
  name,
  image,
  "imageAspect": image.asset->.metadata.dimensions.aspectRatio,
}[0...50]
`;

const People = ({people}) => {

    var tableService = azure.createTableService();
    var query = new azure.TableQuery()
        .top(5);
    tableService.queryEntities('Field', query, null, function (error, result, response) {
        result.entries.forEach(function (field, index) {
            console.log(field.wheatArea._);
            console.log(field.wasteLand._);
            console.log(field.RowKey._);
            console.log(field.water._);
        });
        if (!error) {
            // result.entries contains entities matching the query
        }
    });
    return (
        <Layout>
            <div className="people">
                <ul className="list">
                    {people.map(person => (
                        <li key={person._id} className="list__item">
                            <Link href="/person/[id]" as={`/person/${person._id}`}>
                                <a>
                                    {person.image && (
                                        <img
                                            src={imageUrlFor(person.image).width(300)}
                                            width="300"
                                            height={300 / person.imageAspect}
                                        />
                                    )}
                                    <h3>{person.name}</h3>
                                </a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <style jsx>{`
        .people {
          padding: 1rem;
        }

        .people .list h3 {
          line-height: 1em;
          padding: 0.5em 0;
        }
      `}</style>
            <style jsx>{listStyles}</style>
        </Layout>
    );
};

export const getStaticProps = async () => {
    const people = await sanity.fetch(query);
    return {
        props: {people} // will be passed to the page component as props
    };
}

export default People;
