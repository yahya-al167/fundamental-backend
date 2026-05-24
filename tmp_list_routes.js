import app from "./src/app.js";

function listRoutes(layer, path = "") {
    if (layer.route && layer.route.path) {
        const methods = Object.keys(layer.route.methods)
            .join(",")
            .toUpperCase();
        console.log(methods, path + layer.route.path);
    } else if (layer.name === "router" && layer.handle.stack) {
        layer.handle.stack.forEach((nested) => {
            listRoutes(nested, path);
        });
    }
}

app._router.stack.forEach((layer) => listRoutes(layer));
