const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: "failed", // ✅ WAJIB
            message: error.message,
        });
    }

    next();
};

export default validate;
