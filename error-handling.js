exports.errors404 = (err, req, res, next) => {
  if (err.msg === "Invalid id") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  }
};
