import {List} from 'immutable';
import splitSqlQueries from './splitSqlQueries';

export default function(transformation, queries) {
  if (['redshift', 'mysql', 'snowflake'].indexOf(transformation.get('backend')) >= 0) {
    return splitSqlQueries(queries);
  } else {
    return List([queries]);
  }
}
