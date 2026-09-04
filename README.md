# ShopSphere — Backend (Week 1)

Multi-Vendor E-Commerce Platform — production-oriented architecture foundation.
Week 1 focus: scalable folder structure, config management, DB connection layer,
Vendor & Product CRUD, centralized error handling, request validation, API docs.

## Tech Stack

- **Runtime:** Node.js + Express.js
- **Database:** MongoDB (local) via Mongoose
- **Validation:** Zod (schema-based, on every write endpoint)
- **Docs:** Swagger / OpenAPI (`swagger-jsdoc` + `swagger-ui-express`)
- **Security basics:** Helmet, CORS, bcryptjs (password hashing), JWT (wired up, full auth flow lands Week 2)

## Folder Structure

```
shopsphere/
├── src/
│   ├── modules/
│   │   ├── auth/            # scaffolded now, full login/JWT/RBAC in Week 2
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.model.js
│   │   ├── vendors/
│   │   │   ├── vendor.routes.js       # Express routes + Swagger JSDoc
│   │   │   ├── vendor.controller.js   # thin: parse req -> call service -> respond
│   │   │   ├── vendor.service.js      # business logic lives here
│   │   │   ├── vendor.model.js        # Mongoose schema
│   │   │   └── vendor.validation.js   # Zod schemas
│   │   └── products/
│   │       ├── product.routes.js
│   │       ├── product.controller.js
│   │       ├── product.service.js
│   │       ├── product.model.js
│   │       └── product.validation.js
│   ├── config/
│   │   └── index.js         # loads + validates env vars, fails fast if missing
│   ├── db/
│   │   └── connection.js    # Mongoose connect with retry + graceful shutdown
│   ├── middlewares/
│   │   ├── errorHandler.js  # ONE place that formats every error response
│   │   └── validate.js      # generic Zod request validator
│   ├── utils/
│   │   ├── AppError.js      # custom error class (statusCode + code + message)
│   │   └── catchAsync.js    # wraps async controllers, forwards errors to next()
│   ├── docs/
│   │   └── swagger.js       # OpenAPI spec assembled from route JSDoc comments
│   ├── app.js                # Express app: middleware + route wiring
│   └── server.js             # entry point: connect DB, then start HTTP server
├── .env.example
├── .env                       # local dev values (gitignored in a real repo)
├── package.json
└── README.md
```

**Why this shape:** each module (`auth`, `vendors`, `products`) is self-contained —
routes call controllers, controllers call services, services talk to models.
Nothing outside a module reaches into another module's model directly. This
keeps things independently testable and means adding `orders` or `reviews`
later is just "add another module folder," not "untangle a 2000-line server.js."

## Prerequisites

- Node.js 18+
- MongoDB running **locally** (`mongod` on `127.0.0.1:27017`)

## Setup — Local MongoDB

1. Make sure MongoDB is installed and running locally:
   ```bash
   # check it's up
   mongosh --eval "db.runCommand({ ping: 1 })"
   ```
   If you don't have it installed, install MongoDB Community Server for your OS
   and start the `mongod` service.

2. Copy the env template and adjust if needed (defaults already point at local Mongo):
   ```bash
   cp .env.example .env
   ```
   `.env` already ships with:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/shopsphere_dev
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the dev server (auto-restarts on file changes):
   ```bash
   npm run dev
   ```
   Or without nodemon:
   ```bash
   npm start
   ```

5. You should see:
   ```
   ✅ MongoDB connected -> shopsphere_dev (development)
   🚀 ShopSphere API running on http://localhost:5000 [development]
   📖 Swagger docs: http://localhost:5000/api-docs
   ```

## API Documentation

Once running, open **http://localhost:5000/api-docs** for interactive Swagger UI
(try requests directly from the browser). Raw OpenAPI JSON is at
`http://localhost:5000/api-docs.json`.

## Endpoints (Week 1)

| Method | Endpoint                | Description                     |
|--------|--------------------------|----------------------------------|
| POST   | `/api/v1/vendors`        | Register a vendor               |
| GET    | `/api/v1/vendors`        | List vendors (filter/paginate)  |
| GET    | `/api/v1/vendors/:id`    | Get vendor by id                |
| PATCH  | `/api/v1/vendors/:id`    | Update vendor                   |
| DELETE | `/api/v1/vendors/:id`    | Delete vendor                   |
| POST   | `/api/v1/products`       | Create a product                |
| GET    | `/api/v1/products`       | List products (filter/search)   |
| GET    | `/api/v1/products/:id`   | Get product by id                |
| PATCH  | `/api/v1/products/:id`   | Update product                  |
| DELETE | `/api/v1/products/:id`   | Delete product                  |
| GET    | `/health`                | Health check                    |

All write endpoints (`POST`/`PATCH`) validate the request body with Zod before
it ever reaches a controller — malformed input gets a `422` with a field-level
breakdown, not a stack trace.

## Error Response Shape

Every error, from anywhere in the app, comes back in this consistent shape via
the centralized `errorHandler` middleware:

```json
{
  "success": false,
  "error": {
    "code": "VENDOR_NOT_FOUND",
    "message": "Vendor not found"
  }
}
```

## Quick Test (curl)

```bash
# create a vendor
curl -X POST http://localhost:5000/api/v1/vendors \
  -H "Content-Type: application/json" \
  -d '{"businessName":"Anitha Textiles","email":"anitha@example.com","password":"secret123"}'

# create a product for that vendor (swap in the returned vendor _id)
curl -X POST http://localhost:5000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"vendor":"<VENDOR_ID>","name":"Handloom Cotton Saree","price":1499,"stock":10}'
```

## What's Next (Week 2)

Authentication & Application Security: vendor login, JWT issuance/refresh,
password reset flow, role-based access control middleware — building on the
`auth` module scaffold already in place.
