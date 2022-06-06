exports.siteName = "Services API";

exports.parseResultSet = data => JSON.parse(JSON.stringify(data));

exports.echo = function(obj) {
  // eslint-disable-next-line no-console
  console.log(obj);
};

exports.readBody = function(req) {
  let opt = {};

  let {
    offset,
    limit,
    fields,
    verbose,
    sort_by,
    group_by,
    total_rows
  } = req.query;

  fields = fields ? fields.split(",") : '*';
  
  opt.method = req.method;
  if (opt.method === "PUT" || opt.method === "POST") {
    opt.fields = req.body;
  } else {
    if (fields) {
      opt.columns = fields;
    }
  }
  
  offset = parseInt(offset);
  limit = parseInt(limit);

  if (verbose) opt.verbose = verbose == "true";
  if (limit > 0) opt.limit = limit;
  if (offset > 0) opt.offset = offset;
  if (sort_by) opt.order_by = sort_by;
  if (group_by) opt.group_by = group_by;
  if (total_rows) {
    opt.total_rows = total_rows == "true" ? true : false;
  } else {
    opt.total_rows = false;
  }
  return opt;
};
