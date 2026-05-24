import { nanoid } from "nanoid";

class DocumentsHandler {
    constructor(service) {
        this._service = service;
    }

    postDocumentHandler = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    status: "failed",
                    message: "Unauthorized",
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    status: "failed",
                    message: "File required",
                });
            }

            const id = `doc-${nanoid(16)}`;

            await this._service.addDocument({
                id,
                userId: req.user.id,
                filename: req.file.filename,
                path: req.file.path,
            });

            return res.status(201).json({
                status: "success",
                data: { id },
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getDocumentsHandler = async (req, res) => {
        try {
            const documents = await this._service.getAllDocuments();

            return res.status(200).json({
                status: "success",
                data: { documents },
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    getDocumentByIdHandler = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid id",
                });
            }

            const document = await this._service.getDocumentById(id);

            return res.status(200).json({
                status: "success",
                data: { document },
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Document not found",
                });
            }

            console.error(err);
            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };

    deleteDocumentHandler = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    status: "failed",
                    message: "Unauthorized",
                });
            }

            await this._service.deleteDocument(req.params.id);

            return res.status(200).json({
                status: "success",
                message: "Document deleted",
            });
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({
                    status: "failed",
                    message: "Document not found",
                });
            }

            return res.status(500).json({
                status: "failed",
                message: "Internal server error",
            });
        }
    };
}

export default DocumentsHandler;
