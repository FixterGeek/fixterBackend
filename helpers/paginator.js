exports.paginator = async (queryObject, model, populatedFields = "", extraPopulate = "") => {
  // supporting p page, l number of items, q regex match for basic string keys, f fields to send
  let items
  const { p = 1, l = 50, q, f = "" } = queryObject // f is for projection
  if (p && l) {
    console.log("paginatedd")
    // const count = await Lot.find().count
    let limit = Number(l)
    const page = Number(p)
    const number = Number(l)
    let total = await model.find().countDocuments()
    let pages = Math.ceil(total / number)
    if (q) { // query with certain fields
      let query = {}
      for (let pair of q.split(',')) {
        const splitted = pair.split('=')
        if (splitted[1].trim() === "true" || splitted[1].trim() === "false") query[splitted[0].trim()] = splitted[1].trim()
        else if (splitted[0].trim() === "_id") query[splitted[0].trim()] = splitted[1].trim()
        else query[splitted[0].trim()] = { $regex: new RegExp(splitted[1].trim(), "i") }

      }
      total = await model.find(query).countDocuments()
      pages = Math.ceil(total / number)
      items = await model.find(query)
        .select(f.split(',').join(" "))
        .sort('-updatedAt') // this could be dynamic
        .limit(limit)
        .skip((page * number) - limit)
        .populate(populatedFields)
        .populate(extraPopulate)
    } else {
      items = await model.find()
        .limit(limit)
        .skip((page * number) - limit)
        .sort('-updatedAt')
        .populate(populatedFields)
        .populate(extraPopulate)
    }
    return { page, limit, pages, total, items }
  }
  return await model.find().sort('-updatedAt').limit(100).populate(populatedFields).populate(extraPopulate)
}

exports.promisePaginator = async (queryObject, promise) => {
  let items
  const { p = 1, l = 50, q, f = "" } = queryObject // f is for projection
  let limit = Number(l)
  const page = Number(p)
  const number = Number(l)
  items = await promise.limit(limit).skip((page * number) - limit).sort('-updatedAt')
  let total = await promise.countDocuments()
  let pages = Math.ceil(total / number)
  return { page, limit, pages, total, items }
  
}
